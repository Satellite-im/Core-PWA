import { CID } from 'multiformats'

export type User = {
  did: string
  name: string
  status?: string
  peerId?: string
  seen?: number
  photoHash?: string | CID
  accountUrl?: string
  about?: string
  location?: string
  note?: string
}

export type UserStatus = 'online' | 'offline' | 'busy' | 'away' | 'mobile'

export const UsersError = {
  NETWORK_ERROR: 'errors.users.network',
  USER_NOT_FOUND: 'errors.users.not_found',
}
