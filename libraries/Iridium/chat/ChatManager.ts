import Vue from 'vue'

import Iridium, {
  IridiumMessage,
  Emitter,
  didUtils,
  IridiumPubsubMessage,
} from '@satellite-im/iridium'
import type { SyncSubscriptionResponse } from '@satellite-im/iridium/src/sync/agent'
import type { EmitterCallback } from '@satellite-im/iridium'

import {
  Conversation,
  ConversationMessage,
  ChatError,
  ConversationParticipant,
  ConversationActivity,
  ConversationConnection,
  MessageReactionPayload,
  ConversationMessagePayload,
} from '~/libraries/Iridium/chat/types'
import { Friend } from '~/libraries/Iridium/friends/types'
import { IridiumManager } from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'

export type ConversationPubsubEvent = IridiumMessage<{
  message: ConversationMessage
  type: 'chat/message'
}>

export type State = {
  conversations: { [key: Conversation['id']]: Conversation }
}

const initialState: State = {
  conversations: {},
}

export type Conversations = {
  [key: Conversation['id']]: ConversationMessage[]
}

export default class ChatManager extends Emitter<ConversationMessage> {
  public ready: boolean = false
  public state: State = {
    conversations: {},
  }

  private _intervals: { [key: string]: any } = {}
  private _subscriptions: {
    [key: string]: { topic: string; connected: boolean }
  } = {}

  constructor(public readonly iridium: IridiumManager) {
    super()
  }

  async init() {
    this.state = ((await this.get()) as State) ?? initialState
    const conversations = Object.values(this.state.conversations)
    // listen for sync node subscription responses
    this.iridium.connector?.p2p.on<
      IridiumPubsubMessage<SyncSubscriptionResponse>
    >('node/message/sync/subscribe', this.onSyncSubscriptionResponse.bind(this))

    this.iridium.connector?.p2p.on('ready', async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000))
      if (!this.iridium.connector?.p2p.primaryNodeID) {
        throw new Error('not connected to primary node')
      }
      logger.info('iridium/chatmanager/init', 'p2p ready, initializing chat...')

      for (const conversation of conversations) {
        if (this._subscriptions[conversation.id] !== undefined) continue
        const topic = `/chat/conversations/${conversation.id}`
        this._subscriptions[conversation.id] = { topic, connected: false }

        logger.info(
          'iridium/chatmanager/init',
          `requesting sync subscription to ${topic}`,
        )
        // ask the sync node to subscribe to this topic
        await this.iridium.connector?.p2p.send(
          this.iridium.connector?.p2p.primaryNodeID,
          {
            type: 'sync/subscribe',
            topic,
          },
        )
      }
      this.ready = true
      this.emit('ready', {})
    })
  }

  /**
   * @param message - pubsub message from the sync node
   * @description - handle a sync subscription response from the sync node
   */
  async onSyncSubscriptionResponse(
    message: IridiumPubsubMessage<SyncSubscriptionResponse>,
  ) {
    logger.info(
      'iridium/chatmanager/onSyncSubscriptionResponse',
      'message received from sync node',
      message,
    )
    if (!message.payload.body.topic) {
      throw new Error('no topic in sync subscription response')
    }
    const [conversationId, subscription] =
      Object.entries(this._subscriptions).find(
        ([, { topic }]) => topic === message.payload.body.topic,
      ) || []
    if (!conversationId || !subscription) {
      return
    }
    if (subscription?.connected) {
      throw new Error('subscription already connected')
    }
    if (message.payload.body.success) {
      logger.info(
        'iridium/chatmanager/onSyncSubscriptionResponse',
        `sync node subscribed to ${message.payload.body.topic}`,
      )
      await this.iridium.connector?.subscribe(message.payload.body.topic, {
        handler: this.onConversationMessage.bind(this, conversationId),
      })
      subscription.connected = true
      return
    }
    logger.warn(
      'iridium/chatmanager/onSyncSubscriptionResponse',
      'sync node failed to subscribe',
      message,
    )
  }

  get(path: string = '', options: any = {}) {
    return this.iridium.connector?.get(`/chat${path}`, options)
  }

  set(path: string = '', payload: any, options: any = {}) {
    return this.iridium.connector?.set(`/chat${path}`, payload, options)
  }

  async onConversationMessage(
    conversationId: string,
    { from, payload }: ConversationPubsubEvent,
  ) {
    if (!this.iridium.connector) {
      return
    }
    const conversation = this.getConversation(conversationId)
    if (
      !conversation ||
      !conversation.participants.some((p) => p.did === didUtils.didString(from))
    ) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    const { type, message } = payload.body
    if (type === 'chat/message' && message) {
      Vue.set(
        this.state.conversations[conversationId].message,
        message.id,
        message,
      )
      this.set(
        `/conversations/${conversationId}/message/${message.id}`,
        message,
      )
    }
  }

  hasConversation(id: string) {
    return Object.keys(this.state.conversations).includes(id)
  }

  /**
   * @param {string} name new item name
   * @param {IridiumDirectory} parent empty string if root element
   * @description fetch direct conversation id based on friend did.
   * significantly faster than Iridium.hash until about 5,000,000 conversation records
   */
  directConversationIdFromDid(friendDid: Friend['did']): string | undefined {
    return Object.values(this.state.conversations).find(
      (c) =>
        c.type === 'direct' && c.participants.some((p) => p.did === friendDid),
    )?.id
  }

  async createConversation({
    id,
    type,
    name,
    participants,
  }: {
    id: Conversation['id']
    type: Conversation['type']
    name: Conversation['name']
    participants: Conversation['participants']
  }) {
    if (this.hasConversation(id)) {
      throw new Error(ChatError.CONVERSATION_EXISTS)
    }

    const conversation: Conversation = {
      id,
      type,
      name,
      participants,
      message: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await this.set(`/conversations/${id}`, conversation)
    this.emit(`conversations/${id}`, conversation)

    // ask the sync node to subscribe to this topic
    this._subscriptions[conversation.id] = {
      topic: `/chat/conversations/${id}`,
      connected: false,
    }
    if (this.iridium.connector?.p2p.primaryNodeID) {
      await this.iridium.connector?.p2p.send(
        this.iridium.connector?.p2p.primaryNodeID,
        {
          type: 'sync/subscribe',
          topic: `/chat/conversations/${id}`,
        },
      )
    }

    Vue.set(this.state.conversations, id, conversation)
  }

  getConversation(id: Conversation['id']): Conversation {
    const conversation = this.state.conversations[id]
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    return conversation
  }

  public updateConversation(conversation: Conversation) {
    Vue.set(this.state.conversations, conversation.id, conversation)
  }

  getConversationMessage(
    conversationId: string,
    messageId: string,
  ): ConversationMessage {
    const conversation = this.state.conversations[conversationId]
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    const message = conversation.message[messageId]
    if (!message) {
      throw new Error(ChatError.MESSAGE_NOT_FOUND)
    }
    return message
  }

  /**
   * @method subscribeToConversation
   * @description Adds a watcher to conversation activity
   * @param id {string} conversation id
   * @param onMessage {EmitterCallback<IridiumMessage>} function to be called
   */
  async subscribeToConversation(
    id: string,
    onMessage: EmitterCallback<ConversationMessage>,
  ) {
    this.on(`conversations/${id}`, onMessage)
  }

  /**
   * @method unsubscribeFromConversation
   * @description Removes a watcher from conversation activity
   * @param id {string} conversation id
   * @param onMessage {EmitterCallback<IridiumMessage>} function to be removed
   */
  async unsubscribeFromConversation(
    id: string,
    onMessage?: EmitterCallback<ConversationMessage>,
  ) {
    this.off(`conversations/${id}`, onMessage)
  }

  /**
   * @method sendMessage
   * @description Sends a message to the given groupChat
   */
  async sendMessage(payload: ConversationMessagePayload) {
    if (!this.iridium.connector) {
      return
    }

    const { conversationId } = payload
    const conversation = this.getConversation(conversationId)
    const pids = conversation.participants.map((p) => p.did)
    const messageID = await this.iridium.connector.store(
      {
        ...payload,
        from: this.iridium.connector.id,
        reactions: {},
        attachments: [],
      },
      {
        encrypt: { recipients: pids },
      },
    )
    if (!messageID) {
      throw new Error(ChatError.MESSAGE_NOT_SENT)
    }

    if (!this._subscriptions[conversationId]) {
      // we're not subscribed yet
      throw new Error(`not yet subscribed to conversation ${conversationId}`)
    }

    const messageCID = messageID.toString()
    const message: ConversationMessage = {
      ...payload,
      from: this.iridium.connector.id,
      reactions: {},
      attachments: [],
      id: messageCID,
    }
    Vue.set(
      this.state.conversations[conversationId].message,
      messageCID,
      message,
    )
    this.set(`/conversations/${conversationId}/message/${messageCID}`, message)

    // broadcast the message to connected peers
    await this.iridium.connector.publish(
      `/chat/conversations/${conversationId}`,
      {
        type: 'chat/message',
        message,
      },
      {
        encrypt: { recipients: pids },
      },
    )
  }

  async toggleMessageReaction(payload: MessageReactionPayload) {
    if (!this.iridium.connector) {
      return
    }

    const did = this.iridium.connector.id
    const { conversationId, messageId } = payload
    const message = this.getConversationMessage(conversationId, messageId)

    if (!this._subscriptions[conversationId]) {
      // we're not subscribed yet
      throw new Error(`not yet subscribed to conversation ${conversationId}`)
    }

    const path = `/conversations/${conversationId}/message/${messageId}/reactions/${did}`
    let reactions = ((await this.get(path)) ?? []) as string[]

    const shouldRemove = reactions.includes(payload.reaction)
    if (shouldRemove) {
      reactions = reactions.filter((reaction) => reaction !== payload.reaction)
    } else {
      reactions.push(payload.reaction)
    }

    this.set(path, reactions)
    Vue.set(message.reactions, did, reactions)

    // broadcast the message to connected peers
    await this.iridium.connector.publish(
      `/chat/conversations/${conversationId}`,
      {
        type: 'chat/reaction',
        conversation: conversationId,
        messageCID: messageId,
        userId: did,
        reactions,
      },
    )
  }

  /**
   * @method otherParticipants
   * @description get participants other than yourself
   */
  public getOtherParticipants = (conversationId: string): Friend[] => {
    const conversation = this.getConversation(conversationId)

    return conversation.participants.filter((participant) => {
      return participant.did !== this.iridium.connector?.id
    })
  }

  /**
   * @method typingParticipants
   * @description array of online participants other than yourself
   */
  public getTypingParticipants = (conversationId: string): Friend[] => {
    return this.getOtherParticipants(conversationId).filter(
      (participant) => participant.activity === ConversationActivity.TYPING,
    )
  }

  /**
   * @method onlineParticipants
   * @description array of online participants other than yourself
   */
  public getOnlineParticipants = (conversationId: string): Friend[] => {
    return this.getOtherParticipants(conversationId).filter(
      (participant) => participant.status === 'online',
    )
  }

  /**
   * @method isGroup
   * @description is current recipient group
   */
  public isGroup(conversationId: string): boolean {
    const conversation = this.getConversation(conversationId)
    return conversation.type === 'group'
  }
}
