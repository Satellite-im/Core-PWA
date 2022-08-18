import Vue from 'vue'
import {
  IridiumMessage,
  Emitter,
  didUtils,
  IridiumPubsubMessage,
  IridiumSetOptions,
} from '@satellite-im/iridium'
import type { AddOptions, AddResult } from 'ipfs-core-types/root'
import type { IPFS } from 'ipfs-core-types'
import type { SyncSubscriptionResponse } from '@satellite-im/iridium/src/sync/agent'
import type { EmitterCallback } from '@satellite-im/iridium'
import {
  Conversation,
  ConversationMessage,
  ChatError,
  MessageReactionPayload,
  ConversationMessagePayload,
  MessageAttachment,
} from '~/libraries/Iridium/chat/types'
import { Friend } from '~/libraries/Iridium/friends/types'
import { IridiumManager } from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'
import { ChatFileUpload } from '~/store/chat/types'
import createThumbnail from '~/utilities/Thumbnail'
import { FILE_TYPE } from '~/libraries/Files/types/file'
import { blobToStream } from '~/utilities/BlobManip'
import isNSFW from '~/utilities/NSFW'
import {
  Notification,
  NotificationType,
} from '~/libraries/Iridium/notifications/types'
import * as json from 'multiformats/codecs/json'
export type ConversationPubsubEvent = IridiumMessage<{
  message?: ConversationMessage
  cid?: string
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
  public subscriptions: {
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
        if (this.subscriptions[conversation.id] !== undefined) continue
        const topic = `/chat/conversations/${conversation.id}`
        this.subscriptions[conversation.id] = { topic, connected: false }

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
      Object.entries(this.subscriptions).find(
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
      this.subscriptions = {
        ...this.subscriptions,
        [conversationId]: {
          ...this.subscriptions[conversationId],
          connected: true,
        },
      }
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

  set(path: string = '', payload: any, options: IridiumSetOptions = {}) {
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
      !conversation.participants.includes(didUtils.didString(from))
    ) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    const { type, cid } = payload.body
    if (type === 'chat/message') {
      let message: ConversationMessage
      if (cid) {
        message = await this.iridium.connector.load(cid)
        message.id = cid
      } else if (payload.body.message) {
        message = payload.body.message
      } else {
        throw new Error('no message in payload')
      }

      logger.info(
        'iridium/chatmanager/onConversationMessage',
        'message received',
        { message, cid, from, conversationId },
      )

      Vue.set(
        this.state.conversations[conversationId].message,
        message.id,
        message,
      )
      this.set(
        `/conversations/${conversationId}/message/${message.id}`,
        message,
      )
      const friendName = this.iridium.friends.getFriend(message?.from)
      const buildNotification: Partial<Notification> = {
        fromName: friendName?.name,
        at: Date.now(),
        fromAddress: conversationId,
        title: `New message from ${friendName?.name}`,
        description:
          message.body?.length! > 79
            ? `${message.body?.substring(0, 80)}...`
            : message.body,
        image: message.from,
        type: NotificationType.DIRECT_MESSAGE,
        seen: false,
      }

      this.iridium.notifications?.sendNotification(buildNotification)
    }
  }

  hasConversation(id: string) {
    return Object.keys(this.state.conversations).includes(id)
  }

  /**
   * @param {string} friendDid
   * @description fetch direct conversation id based on friend did.
   * significantly faster than Iridium.hash until about 5,000,000 conversation records
   */
  directConversationIdFromDid(friendDid: Friend['did']): string | undefined {
    return Object.values(this.state.conversations).find(
      (c) => c.type === 'direct' && c.participants.includes(friendDid),
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
    Vue.set(this.state.conversations, id, conversation)
    await this.set(`/conversations/${id}`, conversation)
    this.emit(`conversations/${id}`, conversation)

    // ask the sync node to subscribe to this topic
    this.subscriptions[conversation.id] = {
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
  }

  async deleteConversation(id: Conversation['id']) {
    if (!this.hasConversation(id)) {
      return
    }
    Vue.delete(this.state.conversations, id)
    this.set('/conversations', this.state.conversations)
    // todo - do we need to unsubscribe too?
  }

  getConversation(id: Conversation['id']): Conversation {
    const conversation = this.state.conversations[id]
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    return conversation
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

  async addFile(
    {
      upload,
      conversationId,
    }: { upload: ChatFileUpload; conversationId: string },
    options?: AddOptions,
  ): Promise<MessageAttachment> {
    if (upload.file.size === 0) {
      throw new Error('TODO')
    }
    const thumbnailBlob = await createThumbnail(upload.file, 400)

    return {
      id: await this.upload(upload.file, conversationId),
      name: upload.file.name,
      size: upload.file.size,
      nsfw: await isNSFW(upload.file),
      type: Object.values(FILE_TYPE).includes(upload.file.type as FILE_TYPE)
        ? (upload.file.type as FILE_TYPE)
        : FILE_TYPE.GENERIC,
      thumbnail: thumbnailBlob
        ? await this.upload(thumbnailBlob, conversationId)
        : '',
    }
  }

  async upload(file: Blob, conversationId: string) {
    const conversation = this.getConversation(conversationId)
    if (!this.iridium.connector?.p2p.primaryNodeID) {
      throw new Error('not connected to primary node')
    }

    const data = await file.arrayBuffer()
    return await this.iridium.connector?.store(data, {
      syncPin: true,
      encrypt: {
        recipients: [
          ...conversation.participants,
          this.iridium.connector?.p2p.primaryNodeID,
        ],
      },
    })
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
    console.log(
      'debug: | ChatManager | sendMessage | conversationId',
      conversationId,
    )
    const conversation = this.getConversation(conversationId)
    const message: Partial<ConversationMessage> = {
      ...payload,
      from: this.iridium.connector.id,
      reactions: {},
      attachments: payload.attachments,
    }
    console.log('debug: | ChatManager | sendMessage | message', message)

    message.id = (
      await this.iridium.connector.store(message, {
        syncPin: true,
        encrypt: { recipients: conversation.participants },
      })
    ).toString()

    if (!this.subscriptions[conversationId]) {
      // we're not subscribed yet
      throw new Error(`not yet subscribed to conversation ${conversationId}`)
    }

    Vue.set(
      this.state.conversations[conversationId].message,
      message.id,
      message,
    )
    await this.set(
      `/conversations/${conversationId}/message/${message.id}`,
      message,
    )

    // broadcast the message to connected peers
    await this.iridium.connector.publish(
      `/chat/conversations/${conversationId}`,
      {
        type: 'chat/message',
        cid: message.id,
      },
      {
        encrypt: { recipients: conversation.participants },
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

    if (!this.subscriptions[conversationId]) {
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

    Vue.set(message.reactions, did, reactions)
    this.set(path, reactions)

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
}
