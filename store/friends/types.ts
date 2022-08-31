import { Friend, IncomingRequest, OutgoingRequest } from '~/types/ui/friends'
import { FriendAccount } from '~/libraries/Solana/FriendsProgram/FriendsProgram.types'
import { UserInfo } from '~/libraries/Solana/UsersProgram/UsersProgram'

export interface FriendsState {
  incomingRequests: IncomingRequest[]
  outgoingRequests: OutgoingRequest[]
  all: Friend[]
  activeConversation?: {
    type: string
    target: Friend
  }
}

export enum FriendsError {
  REQUEST_ALREADY_SENT = 'errors.friends.request_already_sent',
  REQUEST_ALREADY_ACCEPTED = 'errors.friends.request_already_accepted',
  FRIEND_INFO_NOT_FOUND = 'errors.friends.friend_info_not_found',
}

export interface FriendRequestArguments {
  did: string
}
