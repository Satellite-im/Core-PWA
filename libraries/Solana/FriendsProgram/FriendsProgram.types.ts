export enum FriendStatus {
  UNINITALIZED,
  PENDING,
  ACCEPTED,
  DENIED,
  REMOVED,
  REQUEST_REMOVED,
}

export enum FriendsEvents {
  NEW_REQUEST = 'new_request',
  NEW_FRIEND = 'new_friend',
  REQUEST_DENIED = 'request_denied',
  REQUEST_REMOVED = 'request_removed',
  FRIEND_REMOVED = 'friend_removed',
}

export interface FriendAccount {
  accountId: string
  from: string
  status: number
  to: string
  fromMailboxId: string
  toMailboxId: string
}
