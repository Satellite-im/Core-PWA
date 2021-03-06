import { FriendMetadata } from '../textile/metadata'
import { BadgeType } from './badge'

export type UserState = 'online' | 'idle' | 'offline' | 'mobile'

export type User = {
  name: string
  address: string
  status?: string
  state: UserState
  unreadCount?: number
  profilePicture: string
  badge?: BadgeType
  userAccount?: any
  mailboxId?: string
  peerId?: string
  textilePubkey?: string
  lastUpdate: number
  metadata?: FriendMetadata
  streams?: Map<string, MediaStream>
}

export interface UserRegistrationData {
  username: string
  photoHash: string
  status: string
}

export interface RawUser {
  name: string
  servers: any
  status: string
  photoHash: string
}
