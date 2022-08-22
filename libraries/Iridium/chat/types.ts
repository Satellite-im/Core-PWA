import { FILE_TYPE } from '~/libraries/Files/types/file'

export type MessageGlyph = {
  packId: string
  src: string
}

export type MessageAttachment = {
  id: string
  name: string
  type: FILE_TYPE
  size: number
  thumbnail: string
  nsfw: boolean
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
  attachments: MessageAttachment[]
  reactions: { [key: string]: string[] }
  replyToId?: string
}

export type ConversationMessagePayload = Omit<
  ConversationMessage,
  'id' | 'from' | 'reactions'
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
  typing?: {
    [key: string]: boolean
  }
  createdAt: number
  updatedAt: number
  message: {
    [key: string]: ConversationMessage
  }
  connected?: boolean
}

export const ChatError = {
  CONVERSATION_EXISTS: 'errors.chat.conversation_exists',
  CONVERSATION_NOT_FOUND: 'errors.chat.conversation_not_found',
  MESSAGE_NOT_FOUND: 'errors.chat.message_not_found',
  MESSAGE_NOT_SENT: 'errors.chat.message_not_sent',
}
