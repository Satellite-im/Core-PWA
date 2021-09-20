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
}

export interface UserRegistrationData {
  username: string
  imageURI: string
  status: string
}
