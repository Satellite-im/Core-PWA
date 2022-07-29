import Vue from 'vue'

import {
  IridiumPeerMessage,
  IridiumPubsubEvent,
  Iridium,
  Emitter,
  EmitterCallback,
} from '@satellite-im/iridium'
// Iridium import above has static function called hash, use to hash this user id and the name of the chat

import {
  Conversation,
  ConversationMessage,
  ChatError,
  ConversationParticipant,
  ConversationActivity,
  ConversationConnection,
} from '~/libraries/Iridium/chat/types'
import { Friend, FriendsError } from '~/libraries/Iridium/friends/types'
import { IridiumManager } from '~/libraries/Iridium/IridiumManager'

export type ConversationPubsubEvent = IridiumPeerMessage<{
  type: string
  conversation: string
  message?: string
  payload?: any
}>

export type State = {
  conversations: { [key: Conversation['id']]: Conversation }
}

const initialState: State = {
  conversations: {},
}

export default class ChatManager extends Emitter<ConversationMessage> {
  public ready: boolean = false
  public subscriptions: string[] = []
  public state: State = {
    conversations: {},
  }

  public messages: {
    [key: Conversation['id']]: Array<ConversationMessage & { id: string }>
  } = {}

  constructor(public readonly iridium: IridiumManager) {
    super()
  }

  async init() {
    await this.fetch()
    await Promise.all(
      Object.keys(this.state.conversations).map(async (id) => {
        // this.iridium.connector?.on(
        //   `/chat/conversations/${id}`,
        //   this.onConversationMessage.bind(this, id),
        // )
        await this.iridium.connector?.subscribe(`/chat/conversations/${id}`)
      }),
    )

    this.ready = true
    this.emit('ready', {})
  }

  async fetch() {
    this.state = ((await this.get()) as State) ?? initialState
    for (const conversation of Object.values(this.state.conversations)) {
      Vue.set(
        this.messages,
        conversation.id,
        Object.entries(conversation.message)
          .map(([key, value]) => ({
            ...value,
            id: key,
          }))
          .sort((a, b) => a.at - b.at),
      )
    }
  }

  get(path: string = '', options: any = {}) {
    return this.iridium.connector?.get(`/chat${path}`, options)
  }

  set(path: string = '', payload: any, options: any = {}) {
    return this.iridium.connector?.set(`/chat${path}`, payload, options)
  }

  // async onConversationMessage(
  //   conversationId: string,
  //   message: ConversationPubsubEvent,
  // ) {
  //   if (!this.iridium.connector) return
  //   const { from, did, payload } = message
  //   const conversation = await this.getConversation(conversationId)
  //   if (!conversation || !conversation.participants.includes(did)) {
  //     throw new Error(ChatError.CONVERSATION_NOT_FOUND)
  //   }
  //   const { type, message: messageCID } = payload
  //   if (type === 'chat/message' && messageCID) {
  //     // TODO: type check the message?
  //     const msg = await this.iridium.connector.load(messageCID, {
  //       decrypt: true,
  //     })
  //     if (msg) {
  //       conversation.messages.push(messageCID)
  //       conversation.message[messageCID] = msg
  //       this.state.conversation[conversationId] = conversation
  //       await this.set(
  //         `/conversations/${conversationId}/messages`,
  //         conversation.messages,
  //       )
  //       await this.set(
  //         `/conversations/${conversationId}/message/${messageCID}`,
  //         msg,
  //       )
  //       await this.saveConversation(conversation)
  //     }
  //   }

  //   this.emit(`conversations/${conversationId}`, payload)
  // }

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

    // this.iridium.connector?.on(
    //   `/chat/conversations/${id}`,
    //   this.onConversationMessage.bind(this, id),
    // )
    Vue.set(this.messages, id, [])
    Vue.set(this.state.conversations, id, conversation)
    await this.iridium.connector?.subscribe(`/chat/conversations/${id}`)
  }

  getConversation(id: string): Conversation {
    const conversation = this.state.conversations[id]
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    return conversation
  }

  public updateConversation(conversation: Conversation) {
    this.state.conversations = {
      ...this.state.conversations,
      [conversation.id]: { ...conversation },
    }
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
  async sendMessage(payload: Omit<ConversationMessage, 'from'>) {
    if (!this.iridium.connector) {
      return
    }

    const { conversationId } = payload

    const conversation = this.getConversation(conversationId)

    const message = {
      ...payload,
      from: this.iridium.connector.id,
    }

    const messageID = await this.iridium.connector.store(message, {
      encrypt: { recipients: conversation.participants },
    })
    if (!messageID) {
      throw new Error(ChatError.MESSAGE_NOT_SENT)
    }
    const messageCID = messageID.toString()
    this.messages[conversationId].push({ ...message, id: messageCID })
    this.set(`/conversations/${conversationId}/message/${messageCID}`, message)

    // broadcast the message to connected peers
    await this.iridium.connector.broadcast(
      `/chat/conversations/${conversationId}`,
      {
        type: 'chat/message',
        conversation: conversationId,
        message: messageCID,
      },
    )

    const pids = (
      await Promise.all(
        conversation.participants.map((p) => Iridium.DIDToPeerId(p.did)),
      )
    ).map((pid) => pid.toString())

    await this.iridium.connector.send(
      { type: 'chat/message', conversationId, messageCID },
      {
        to: pids,
      },
    )
  }

  /**
   * @method otherParticipants
   * @description get participants other than yourself
   */
  public getOtherParticipants = (conversationId: string): Friend[] => {
    const conversation = this.getConversation(conversationId)

    return conversation.participants.filter(
      (participant) => participant.name !== null,
    )
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
