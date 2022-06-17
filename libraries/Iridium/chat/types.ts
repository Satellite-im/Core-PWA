export type ConversationMessage = {
  conversation: string
  from: string
  body: string
  at: number
  type: string
  attachments: string[]
}

export type Conversation = {
  id: string
  type: 'direct' | 'group'
  participants: string[]
  createdAt: string
  updatedAt: string
  messages: ConversationMessage[]
}

export const ChatError = {
  CONVERSATION_NOT_FOUND: 'error.chat.conversation_not_found',
  MESSAGE_NOT_SENT: 'error.chat.message_not_sent',
}
