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
} from '~/libraries/Iridium/chat/types'
import { FriendsError } from '~/libraries/Iridium/friends/types'
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
    console.dir(this.state)
    for (const conversation of Object.values(this.state.conversations)) {
      Vue.set(
        conversation,
        'messageArray',
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

  async directConversationId(recipientId: string) {
    return Iridium.hash([recipientId, this.iridium.connector?.id].sort())
  }

  async createConversation({
    type,
    name,
    participants,
  }: Omit<
    Conversation,
    'id' | 'message' | 'messageArray' | 'createdAt' | 'updatedAt'
  >) {
    const id =
      type === 'direct'
        ? await Iridium.hash(participants.sort())
        : await Iridium.hash({ name, origin: this.iridium.connector?.id }) // TODO: generate random hash for group chat

    if (!id) {
      throw new Error(FriendsError.FRIEND_NOT_FOUND)
    }

    if (this.hasConversation(id)) {
      throw new Error(ChatError.CONVERSATION_EXISTS)
    }

    const conversation: Omit<Conversation, 'messageArray'> = {
      id,
      type,
      name,
      participants,
      message: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await this.set(`/conversations/${id}`, conversation)
    Vue.set(this.state.conversations, id, { ...conversation, messageArray: [] })

    this.emit(`conversations/${id}`, conversation)
    // this.iridium.connector?.on(
    //   `/chat/conversations/${id}`,
    //   this.onConversationMessage.bind(this, id),
    // )
    await this.iridium.connector?.subscribe(`/chat/conversations/${id}`)
  }

  getConversation(id: string): Conversation {
    const conversation = this.state.conversations[id]
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    return conversation
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
    conversation.messageArray.push({ ...message, id: messageCID })
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
        conversation.participants.map((p) => Iridium.DIDToPeerId(p)),
      )
    ).map((pid) => pid.toString())

    await this.iridium.connector.send(
      { type: 'chat/message', conversationId, messageCID },
      {
        to: pids,
      },
    )
  }
}
