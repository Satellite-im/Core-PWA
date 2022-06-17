import { EmitterCallback } from '~/../iridium/dist/emitter'
import { Emitter } from '@satellite-im/iridium/dist/index.browser'
import {
  Conversation,
  ConversationMessage,
  ChatError,
} from '~/libraries/Iridium/chat/types'
import { IridiumManager } from '~/libraries/Iridium/IridiumManager'

export default class ChatManager extends Emitter<ConversationMessage> {
  constructor(public readonly iridium: IridiumManager) {
    super()
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
      `/conversation/${id}`,
    )
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
    this.on(`conversation:${id}`, onMessage)
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
    this.off(`conversation:${id}`, onMessage)
  }

  /**
   * @method sendMessage
   * @description Sends a message to the given groupChat
   * @param group
   * @param message Message to be sent
   */
  async sendMessage(chatId: string, message: ConversationMessage) {
    const conversation = await this.getConversation(chatId)
    if (!conversation) {
      throw new Error(ChatError.CONVERSATION_NOT_FOUND)
    }

    const messageID = await this.iridium.connector?.store(message, {
      encrypt: { recipients: conversation.participants },
    })
    if (!messageID) {
      throw new Error(ChatError.MESSAGE_NOT_SENT)
    }

    conversation.messages.push(message)
    await this.iridium.connector?.set(`/conversation/${chatId}`, conversation)
  }
}
