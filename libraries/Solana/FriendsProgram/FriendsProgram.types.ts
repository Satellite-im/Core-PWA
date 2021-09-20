export interface CreateFriendParams {
  createAccount: {
    friend: { friendKey: Uint8Array }
  }
}

export interface InitFriendRequestParams {
  makeRequest: { tex: [Uint8Array, Uint8Array, Uint8Array, Uint8Array] }
}

export interface InitAcceptFriendRequestParams {
  acceptRequest: { tex: [Uint8Array, Uint8Array, Uint8Array, Uint8Array] }
}

export interface InitDenyFriendRequestParams {
  denyRequest: {}
}

export interface InitRemoveFriendRequestParams {
  removeRequest: {}
}

export interface InitRemoveFriendParams {
  removeFriend: {}
}

export type FriendsInstructionType =
  | CreateFriendParams
  | InitFriendRequestParams
  | InitAcceptFriendRequestParams
  | InitDenyFriendRequestParams
  | InitRemoveFriendRequestParams
  | InitRemoveFriendParams

export enum FriendStatus {
  NOT_ASSIGNED,
  PENDING,
  ACCEPTED,
  REFUSED,
  REMOVED,
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
  fromMailboxId: string
  toMailboxId: string
  to: string
}
