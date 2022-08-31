import { CID } from 'multiformats'

export type User = {
  did: string
  name: string
  peerId?: string
  seen?: number
  photoHash?: string | CID
  status?: string
  accountUrl?: string
  about?: string
}

export type UserStatus = 'online' | 'offline' | 'busy' | 'away' | 'mobile'

export type UserType = User & { status: UserStatus }

export const UsersError = {
  NETWORK_ERROR: 'errors.users.network',
  USER_NOT_FOUND: 'errors.users.not_found',
}
