// TODO: Replace User (friends/types.ts) and GroupMemberDetails (groups/types.ts) with User (users/types.ts)
export type User = {
  did: string
  name: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  seen?: number
  photoHash?: string
}

export const UsersError = {
  NETWORK_ERROR: 'errors.users.network',
  USER_NOT_FOUND: 'errors.users.not_found',
}
