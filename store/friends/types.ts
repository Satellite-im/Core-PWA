import { PublicKey } from '@solana/web3.js'

export enum FriendsError {
  REQUEST_ALREADY_SENT = 'errors.friends.request_already_sent',
  REQUEST_ALREADY_ACCEPTED = 'errors.friends.request_already_accepted',
}

export interface CreateFriendRequestArguments {
  friendToKey: PublicKey
  textileMailboxId: string
}
