// TODO: Replace User (friends/types.ts) and GroupMemberDetails (groups/types.ts) with User (users/types.ts)
export type User = {
  did: string
  name: string
  peerId?: string
  seen?: number
  photoHash?: string
}

export type UserStatus = 'online' | 'offline' | 'busy' | 'away' | 'mobile'

export type UserType = User & { status: UserStatus }

export const UsersError = {
  NETWORK_ERROR: 'errors.users.network',
  USER_NOT_FOUND: 'errors.users.not_found',
}
