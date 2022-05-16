import { PublicKey } from '@solana/web3.js'
import { Friend, IncomingRequest, OutgoingRequest } from '~/types/ui/friends'
import { FriendAccount } from '~/libraries/Solana/FriendsProgram/FriendsProgram.types'
import { UserInfo } from '~/libraries/Solana/UsersProgram/UsersProgram'
export interface FriendsState {
  incomingRequests: IncomingRequest[]
  outgoingRequests: OutgoingRequest[]
  all: Friend[]
}

export enum FriendsError {
  REQUEST_ALREADY_SENT = 'errors.friends.request_already_sent',
  REQUEST_ALREADY_ACCEPTED = 'errors.friends.request_already_accepted',
  FRIEND_INFO_NOT_FOUND = 'errors.friends.friend_info_not_found',
  TEXTILE_NOT_INITIALIZED = 'errors.friends.textile_not_initialized',
}

export interface CreateFriendRequestArguments {
  friendToKey: PublicKey
}
export interface AcceptFriendRequestArguments {
  friendRequest: IncomingRequest
}

/**
 * Utility function that converts a FriendAccount
 * into an strongly typed IncomingRequest
 * @param friendAccount the FriendAccount data
 * @returns IncomingRequest object
 */
export function friendAccountToIncomingRequest(
  friendAccount: FriendAccount,
  userInfo: UserInfo | null,
): IncomingRequest {
  return {
    requestId: friendAccount.accountId,
    from: friendAccount.from,
    account: friendAccount,
    pending: false,
    userInfo,
  }
}

/**
 * Utility function that converts a FriendAccount
 * into an strongly typed OutgoingRequest
 * @param friendAccount the FriendAccount data
 * @returns OutgoingRequest object
 */
export function friendAccountToOutgoingRequest(
  friendAccount: FriendAccount,
  userInfo: UserInfo | null,
): OutgoingRequest {
  return {
    requestId: friendAccount.accountId,
    to: friendAccount.to,
    account: friendAccount,
    pending: false,
    userInfo,
  }
}
