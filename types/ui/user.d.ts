import { FriendMetadata } from '../textile/metadata'
import { BadgeType } from './badge'

export type UserState = 'online' | 'idle' | 'offline' | 'mobile'

export type User = {
  name: string
  address: string
  status?: string
  state: UserState
  unreadCount?: Number
  profilePicture?: string
  badge?: BadgeType
  userAccount?: any
  mailboxId?: string
  textilePubkey?: string
  lastUpdate: number
  metadata?: FriendMetadata
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
