export type ConversationMessage = {
  conversationId: string
  from: string
  body: string
  at: number
  type: 'text' | 'file' | 'group' | 'glyph' | 'divider' | 'string'
  attachments: string[]
}

export type Conversation = {
  id: string
  type: 'direct' | 'group'
  name?: string
  participants: string[]
  createdAt: number
  updatedAt: number
  messages: {
    [key: string]: ConversationMessage
  }
  messageArray: ConversationMessage[]
}

export const ChatError = {
  CONVERSATION_EXISTS: 'error.chat.conversation_exists',
  CONVERSATION_NOT_FOUND: 'error.chat.conversation_not_found',
  MESSAGE_NOT_SENT: 'error.chat.message_not_sent',
}
