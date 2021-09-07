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
  denyRequest: { tex: [Uint8Array, Uint8Array, Uint8Array, Uint8Array] }
}

export interface InitRemoveFriendRequestParams {
  removeRequest: { tex: [Uint8Array, Uint8Array, Uint8Array, Uint8Array] }
}

export interface InitRemoveFriendParams {
  removeFriend: { tex: [Uint8Array, Uint8Array, Uint8Array, Uint8Array] }
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
