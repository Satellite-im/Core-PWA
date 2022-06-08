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
