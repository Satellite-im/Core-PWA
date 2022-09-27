import { IridiumPeerIdentifier } from '~/../iridium/dist'
import { FILE_TYPE } from '~/libraries/Files/types/file'

export type MessageGlyph = {
  packId: string
  src: string
}

export type MessageAttachment = {
  cid: string
  name: string
  type: FILE_TYPE
  size: number
  nsfw: boolean
}

export type MessageCall = {
  wasAnswered?: boolean
  endedAt?: number
}

export type ConversationMessageType =
  | 'text'
  | 'file'
  | 'group'
  | 'glyph'
  | 'divider'
  | 'string'
  | 'member_join'
  | 'member_leave'
  | 'call'

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
  payload?: any
  replyToId?: string
  members?: string[]
  lastEditedAt?: number
  call?: MessageCall
}

export type ConversationMessagePayload = Omit<
  ConversationMessage,
  'id' | 'from' | 'reactions'
>

export type MessageReaction = {
  conversationId: string
  messageId: string
  userId: string
  reactions: string[]
}

export type MessageReactionPayload = {
  conversationId: string
  messageId: string
  reaction: string
  remove?: boolean
}

export type MessageEditPayload = {
  conversationId: string
  messageId: string
  body: string
}

export type MessageEdit = MessageEditPayload & {
  lastEditedAt: number
}

export type Conversation = {
  id: string
  type: 'direct' | 'group'
  name?: string
  participants: string[]
  createdAt: number
  updatedAt: number
  lastReadAt: number
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

export type ConversationEventType = 'create' | 'add_member' | 'remove_member'

export type IridiumConversationEvent = {
  id: string
  type: ConversationEventType
  name?: string
  participants?: IridiumPeerIdentifier[]
}
