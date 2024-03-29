import {
  RpcResponseAndContext,
  SignatureResult,
  Keypair,
  PublicKey,
  ConfirmOptions,
} from '@solana/web3.js'

export interface RawUser {
  name: string
  servers: any
  status: string
  photoHash: string
}

export interface User {
  address: string
  name: string
  photoHash: string
  status: string
  bannerImageHash: string
  extra1: string
  extra2: string
}

export interface Group {
  id: string
  name: string
  admin: string
  creator: string
  membersCount: number
  openInvites: boolean
  encryptionKey: string
  address: string
}

export interface Account {
  mnemonic?: string
  privateKey?: string
  path?: string
  publicKey: PublicKey
  secretKey?: Uint8Array
  address: string
}

export interface CreateUserParams {
  account: Account
  name: string
  photoHash: string
  status: string
}

export interface FriendAccount {
  accountId: string
  from: string
  status: number
  fromMailboxId: string
  toMailboxId: string
  to: string
}

export interface SendFriendRequestParams {
  fromAccount: Account
  toAddress: string
  fromMailboxId: string
}

export interface AcceptFriendRequestParams {
  friendKey: PublicKey
  userFromKey: PublicKey
  userToAccount: Keypair
  toPaddedBuffer: Uint8Array
  confirmOptionsOverride?: ConfirmOptions
}

export interface RemoveFriendRequestParams {
  friendKey: PublicKey
  userFromAccount: Keypair
  userToKey: PublicKey
  confirmOptionsOverride?: ConfirmOptions
}

export interface DenyFriendRequestParams {
  friendKey: PublicKey
  userFromKey: PublicKey
  userToAccount: Keypair
  confirmOptionsOverride?: ConfirmOptions
}

export interface RemoveFriendParams {
  friendAccount: FriendAccount
  signer: Keypair
  confirmOptionsOverride?: ConfirmOptions
}

export enum FriendStatus {
  UNINITIALIZED,
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

export interface FindFriendsParams {
  account: Account
  filter: FriendStatus
}

export interface IncomingFriendRequest extends FriendAccount {
  fromUser: User | null
}

export interface OutgoingFriendRequest extends FriendAccount {
  toUser: User | null
}

export interface Adapter {
  _getConnectionStatus(): boolean
  createRandomAccount(): Promise<Account | undefined>
  signMessage(message: string): Promise<Uint8Array>

  getAccountFromMnemonic(mnemonic?: string): Promise<Account | null>
  getAccountBalance(account: Account): Promise<number | null>
  requestAirdrop(): Promise<RpcResponseAndContext<SignatureResult> | null>
  getActiveAccount(): Promise<Account | undefined>
  getPayerAccount(): Promise<Account | undefined>
}
