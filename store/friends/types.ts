import { PublicKey } from '@solana/web3.js'
import { Friend, IncomingRequest, OutgoingRequest } from '~/types/ui/friends'
export interface FriendsState {
  incomingRequests: IncomingRequest[]
  outgoingRequests: OutgoingRequest[]
  all: Friend[]
}

export enum FriendsError {
  REQUEST_ALREADY_SENT = 'errors.friends.request_already_sent',
  REQUEST_ALREADY_ACCEPTED = 'errors.friends.request_already_accepted',
  FRIEND_INFO_NOT_FOUND = 'errors.friends.friend_info_not_found',
}

export interface CreateFriendRequestArguments {
  friendToKey: PublicKey
  textileMailboxId: string
}
export interface AcceptFriendRequestArguments {
  friendRequest: IncomingRequest
  textileMailboxId: string
}
