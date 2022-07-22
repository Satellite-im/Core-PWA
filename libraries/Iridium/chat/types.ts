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
  message: {
    [key: string]: ConversationMessage
  }
}

export const ChatError = {
  CONVERSATION_EXISTS: 'errors.chat.conversation_exists',
  CONVERSATION_NOT_FOUND: 'errors.chat.conversation_not_found',
  MESSAGE_NOT_SENT: 'errors.chat.message_not_sent',
}
