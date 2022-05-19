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
  servers?: any
  status: string
  photoHash: string
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
  privateKey: string
  path?: string
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
  UNINITALIZED,
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
  setPhotoHash(photoHash: string): Promise<string>
  createRandomAccount(): Promise<Account | undefined>
  initUserProgram(): Promise<void>
  getAccountFromMnemonic(mnemonic: string): Promise<Account | null>
  getAccountBalance(account: Account): Promise<number | null>
  requestAirdrop(): Promise<RpcResponseAndContext<SignatureResult> | null>
  createUser(params: CreateUserParams): Promise<boolean>
  getActiveAccount(): Promise<Keypair | undefined>

  getCurrentUserInfo(): Promise<User | null>
  getUserInfo(address: string): Promise<User | null>
  getUsersInfo(addresses: string[]): Promise<User[]>

  getFriendsByStatus(
    status: FriendStatus,
  ): Promise<{ incoming: FriendAccount[]; outgoing: FriendAccount[] }>
  subscribeToEvents(): Promise<void>
  addEventListener(
    type: FriendsEvents,
    callback: (data?: FriendAccount) => void,
  ): void
  computeAccountKeys(
    from: PublicKey,
    to: PublicKey,
  ): Promise<{ request: PublicKey; first: PublicKey; second: PublicKey }>
  getFriendsPayer(): Promise<Keypair>
  getAccountStatus(accountKey: PublicKey): Promise<FriendStatus>
  makeFriendRequest(
    request: PublicKey,
    first: PublicKey,
    second: PublicKey,
    k: String,
  ): Promise<string>
  getFriendAccount(accountKey: PublicKey): Promise<FriendAccount | null>
  acceptFriendRequest(request: PublicKey, k: String): Promise<string>
  denyFriendRequest(request: PublicKey): Promise<string>
  removeFriendRequest(request: PublicKey): Promise<string>
  removeFriend(request: PublicKey): Promise<string>
  closeFriendRequest(request: PublicKey): Promise<string>

  getPayerAccount(): Promise<Keypair | undefined>
  createGroup(groupId: string, name: string): Promise<Group>
  getUserGroups(address: string | PublicKey): Promise<Group[]>
  getGroupsUsers(groupIds: string[]): Promise<{ id: string; users: string[] }[]>
  inviteToGroup(groupId: string, recipient: string): Promise<void>
  addGroupInviteListener(cb: (group: Group) => void): Promise<string>
  unsubscribeGroupInviteListener(id: number): Promise<void>
  addGroupListener(id: string, cb: (value: Group) => void): Promise<string>
  removeGroupListeners(keys: string[]): Promise<void>
  getGroupById(id: string): Promise<Group>
  getGroupUsers(groupId: string): Promise<string[]>
  addGroupsListener(cb: (value: Group) => void): Promise<string[]>
}
