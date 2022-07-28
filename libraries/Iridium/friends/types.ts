export type User = {
  did: string
  name: string
  peerId?: string
  status?: 'online' | 'offline' | 'busy' | 'away'
  seen?: number
  photoHash?: string
}

export type Friend = User & {}

export type FriendRequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'removed'

export type FriendRequest = {
  user: User
  incoming: boolean
  status: FriendRequestStatus
  at: number
}

export const FriendsError = {
  NETWORK_ERROR: 'errors.friends.network',
  FRIEND_EXISTS: 'errors.friends.exists',
  FRIEND_NOT_FOUND: 'errors.friends.not_found',
  REQUEST_NOT_FOUND: 'errors.friends.request_not_found',
  REQUEST_NOT_SENT: 'errors.friends.request_not_sent',
  REQUEST_ALREADY_SENT: 'errors.friends.request_already_sent',
}
