import { Friend } from '~/libraries/Iridium/friends/types'

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
  participants: Friend[]
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

export enum ConversationConnection {
  CONNECTED = 'CONNECTED',
  CONNECTING = 'CONNECTING',
  DISCONNECTED = 'DISCONNECTED',
  DISCONNECTING = 'DISCONNECTING',
  ERROR = 'ERROR',
}

export enum ConversationActivity {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  TYPING = 'TYPING',
  NOT_TYPING = 'NOT_TYPING',
}

export type ConversationParticipant = {
  peerId?: string
  address: string
  name?: string // will be undefined for self
  profilePicture?: string
  state?: ConversationConnection
  activity?: ConversationActivity
  updatedAt?: number
  textilePubkey?: string // will be undefined for self
}

export type ConversationState = {
  id: string
  type: 'friend' | 'group'
  calling: boolean
  participants: Array<ConversationParticipant>
}
