import { User } from '../users/types'

export type Friend = User & {}

export type FriendRequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'removed'

export type FriendRequest = {
  did: User['did']
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
