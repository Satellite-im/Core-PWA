import { FriendMetadata } from '../textile/metadata'
import { FriendAccount } from '~/libraries/Solana/FriendsProgram/FriendsProgram.types'
import { UserInfo } from '~/libraries/Solana/UsersProgram/UsersProgram'
import { User } from '~/types/ui/user'
import { Call } from '~/libraries/WebRTC/Call'

export interface EncryptedFriend extends User {
  encryptedTextilePubkey: string
}

export interface FriendRequest {
  requestId: string
  account: FriendAccount
  pending: boolean
  userInfo: UserInfo | null
}

export interface IncomingRequest extends FriendRequest {
  from: string
  account: FriendAccount
}

export interface Friend extends EncryptedFriend {
  publicKey: string
  typingState: 'TYPING' | 'NOT_TYPING'
  textilePubkey: string
  item: any // TODO remove unnecessary properties AP-393
  pending: Boolean
  stored: Boolean
  account: FriendAccount
  address: string
  name: string
  // possibly break these out into different types. These optional fields come up in the friends list, add, request area
  request?: IncomingRequest
  photoHash?: string
  metadata?: FriendMetadata
  peerId?: string
  call?: Call
  status: string
}

export interface OutgoingRequest extends FriendRequest {
  to: string
}
