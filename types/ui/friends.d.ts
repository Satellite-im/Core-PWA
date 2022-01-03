import { FriendAccount } from '~/libraries/Solana/FriendsProgram/FriendsProgram.types'
import { RawUser, User } from '~/types/ui/user'

export interface EncryptedFriend extends User {
  encryptedTextilePubkey: string
}

export interface Friend extends EncryptedFriend {
  publicKey: string
  typingState: 'TYPING' | 'NOT_TYPING'
  textilePubkey: string
  item: any // TODO remove unnecessary properties AP-393
  pending: Boolean
  activeChat: Boolean
  account: FriendAccount
}

export interface FriendRequest {
  requestId: string
  account: FriendAccount
  pending: boolean
}

export interface IncomingRequest extends FriendRequest {
  from: string
  userInfo: RawUser | null
  account: FriendAccount
}

export interface OutgoingRequest extends FriendRequest {
  to: string
}
