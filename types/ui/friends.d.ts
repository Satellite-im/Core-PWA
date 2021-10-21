import { FriendAccount } from '~/libraries/Solana/FriendsProgram/FriendsProgram.types'
import { RawUser, User } from '~/types/ui/user'

export interface EncryptedFriend extends User {
  publicKey: string
  encryptedMailboxId: string
}

export interface Friend extends EncryptedFriend {
  mailboxId: string
  item: any // TODO remove unnecessary properties
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
