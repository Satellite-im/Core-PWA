import {
  IridiumPeerMessage,
  IridiumPubsubEvent,
  Iridium,
  Emitter,
  EmitterCallback,
} from '@satellite-im/iridium/'
// Iridium import above has static function called hash, use to hash this user id and the name of the chat

import {
  Conversation,
  ConversationMessage,
  ChatError,
} from '~/libraries/Iridium/chat/types'
import { IridiumManager } from '~/libraries/Iridium/IridiumManager'

export type ConversationPubsubEvent = IridiumPeerMessage<{
  type: string
  conversation: string
  message?: string
  payload?: any
}>
export default class ChatManager extends Emitter<ConversationMessage> {
  public ready: boolean = false
  public subscriptions: string[] = []
  public state: {
    conversations: string[]
    conversation: { [key: string]: Conversation }
  } = {
    conversations: [],
    conversation: {},
  }

  constructor(public readonly iridium: IridiumManager) {
    super()
  }

  async init() {
    await this.fetch()
    await Promise.all(
      this.state.conversations.map(async (conversationId) => {
        this.iridium.connector?.on(
          `chat/conversation/${conversationId}`,
          this.onConversationMessage.bind(this, conversationId),
        )
        await this.iridium.connector?.subscribe(
          `/chat/conversation/${conversationId}`,
        )
      }),
    )

    this.ready = true
    this.emit('ready', {})
  }

  async fetch() {
    this.state = (await this.iridium.connector?.get('/chat')) || {
      conversations: [],
      conversation: {},
    }
  }

  async onConversationMessage(
    conversationId: string,
    message: ConversationPubsubEvent,
  ) {
    if (!this.iridium.connector) return
    const { from, did, payload } = message
    const conversation = await this.getConversation(conversationId)
    if (!conversation || !conversation.participants.includes(did)) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    const { type, message: messageCID } = payload
    if (type === 'message' && messageCID) {
      // TODO: type check the message?
      const msg = await this.iridium.connector.load(messageCID, {
        decrypt: true,
      })
      if (msg) {
        conversation.messages.push(msg)
        await this.iridium.connector?.set(
          `/chat/conversation/${conversationId}`,
          conversation,
        )
      }
    }

    this.emit(`conversation/${conversationId}`, payload)
  }

  async createConversation(
    name: string,
    type: 'group' | 'direct',
    participants: string[],
  ) {
    const id =
      type === 'direct'
        ? participants.find((p) => p !== this.iridium.connector.id)
        : await Iridium.hash({ name, origin: this.iridium.connector.id })
    if (this.state.conversations.includes(id)) {
      throw new Error(ChatError.CONVERSATION_EXISTS)
    }
    const conversation = {
      id,
      type,
      name,
      participants,
      messages: [],
      message: {},
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    await this.iridium.connector?.set(`/chat/conversation/${id}`, conversation)
    await this.iridium.connector?.set(`/chat/conversations`, [
      ...this.state.conversations,
      id,
    ])
    this.state.conversation[id] = conversation
    this.emit(`conversation/${id}`, conversation)
    this.emit(`conversations`, this.state.conversations)
  }

  /**
   * @method getConversation
   * Retrieve a conversation with a specific user, filtered by the given query parameters
   * @param friendIdentifier friend mailboxId
   * @param query parameters for filtering
   * @param lastInbound timestamp of last received message
   * @returns an array of messages
   */
  async getConversation(id: string): Promise<Conversation> {
    const conversation = await this.iridium.connector?.get(
      `/chat/conversation/${id}`,
    )
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    this.state.conversation[id] = conversation
    this.emit(`conversation/${id}`, conversation)
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
    this.on(`conversation/${id}`, onMessage)
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
    this.off(`conversation/${id}`, onMessage)
  }

  /**
   * @method sendMessage
   * @description Sends a message to the given groupChat
   * @param group
   * @param message Message to be sent
   */
  async sendMessage(id: string, message: ConversationMessage) {
    if (!this.iridium.connector) return
    const conversation = await this.getConversation(id)
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }

    const messageID = await this.iridium.connector.store(message, {
      encrypt: { recipients: conversation.participants },
    })
    if (!messageID) {
      throw new Error(ChatError.MESSAGE_NOT_SENT)
    }
    const messageCID = messageID.toString()
    await this.iridium.connector.set(
      `/chat/conversation/messages`,
      conversation.messages,
    )
    await this.iridium.connector.set(
      `/chat/conversation/message/${messageCID}`,
      message,
    )
    await this.iridium.connector.broadcast(`/chat/conversation/${id}`, {
      action: 'message',
      message: messageCID,
    })
    this.emit(`conversation/${id}`, {
      action: 'message',
      message: messageCID,
      from: this.iridium.connector.did,
    })
  }
}
