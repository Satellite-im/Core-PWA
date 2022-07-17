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
          `/chat/conversation/${conversationId}`,
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

  async saveConversation(conversation: Conversation) {
    await this.iridium.connector?.set(
      `/chat/conversation/${conversation.id}`,
      conversation,
    )
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
    if (type === 'chat/message' && messageCID) {
      // TODO: type check the message?
      const msg = await this.iridium.connector.load(messageCID, {
        decrypt: true,
      })
      if (msg) {
        conversation.messages.push(messageCID)
        conversation.message[messageCID] = msg
        this.state.conversation[conversationId] = conversation
        await this.iridium.connector.set(
          `/chat/conversation/${conversationId}/messages`,
          conversation.messages,
        )
        await this.iridium.connector.set(
          `/chat/conversation/${conversationId}/message/${messageCID}`,
          msg,
        )
        await this.saveConversation(conversation)
      }
    }

    this.emit(`conversation/${conversationId}`, payload)
  }

  hasConversation(id: string) {
    return this.state.conversations.includes(id)
  }

  async directConversationId(recipientId: string) {
    return Iridium.hash([recipientId, this.iridium.connector?.id].sort())
  }

  async createConversation(
    name: string,
    type: 'group' | 'direct',
    participants: string[],
  ) {
    const id =
      type === 'direct'
        ? await Iridium.hash(participants.sort())
        : await Iridium.hash({ name, origin: this.iridium.connector?.id })

    if (!id) {
      throw new Error(FriendsError.FRIEND_NOT_FOUND)
    }
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
      lastMessageAt: 0,
    }
    await this.iridium.connector?.set(`/chat/conversation/${id}`, conversation)
    await this.iridium.connector?.set(`/chat/conversations`, [
      ...this.state.conversations,
      id,
    ])
    this.state.conversation[id] = conversation
    this.state.conversations.push(id)

    this.emit(`conversation/${id}`, conversation)
    this.emit(`conversations`, this.state.conversations)
    this.iridium.connector?.on(
      `/chat/conversation/${id}`,
      this.onConversationMessage.bind(this, id),
    )
    await this.iridium.connector?.subscribe(`/chat/conversation/${id}`)
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
    const conversation = await this.iridium.connector?.get<Conversation>(
      `/chat/conversation/${id}`,
    )
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }
    return conversation
  }

  loadMessages(id: string) {
    if (id && this.hasConversation(id)) {
      return Object.values(this.state.conversation[id]?.message)
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
    conversation.message[messageCID] = message
    conversation.messages.push(messageCID)
    conversation.lastMessageAt = Date.now()
    this.state.conversation[id] = conversation
    await this.iridium.connector.set(
      `/chat/conversation/${id}/messages`,
      conversation.messages,
    )
    await this.iridium.connector.set(
      `/chat/conversation/${id}/message/${messageCID}`,
      message,
    )
    await this.saveConversation(conversation)
    // broadcast the message to connected peers
    await this.iridium.connector.broadcast(`/chat/conversation/${id}`, {
      type: 'chat/message',
      conversation: id,
      message: messageCID,
    })

    const pids = (
      await Promise.all(
        conversation.participants.map((p) => Iridium.DIDToPeerId(p)),
      )
    ).map((pid) => pid.toString())

    await this.iridium.connector.send(
      { type: 'chat/message', conversationId: id, messageCID },
      {
        to: pids,
      },
    )
  }
}
