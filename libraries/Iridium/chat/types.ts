import { Glyph } from '~/types/ui/glyph'

export type MessageGlyph = {
  src: string
  pack: Glyph
}

export type ConversationMessageType =
  | 'text'
  | 'file'
  | 'group'
  | 'glyph'
  | 'divider'
  | 'string'

export type ConversationMessage = {
  id: string
  conversationId: string
  from: string
  type: ConversationMessageType
  at: number
  body?: string
  glyph?: MessageGlyph
  attachments: string[]
  reactions: { [key: string]: string[] }
  replyToId?: string
}

export type ConversationMessagePayload = Omit<
  ConversationMessage,
  'id' | 'from'
>

export type MessageReactionPayload = {
  conversationId: string
  messageId: string
  reaction: string
  remove?: boolean
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
  MESSAGE_NOT_FOUND: 'errors.chat.message_not_found',
  MESSAGE_NOT_SENT: 'errors.chat.message_not_sent',
}
