import {
  Keypair,
  PublicKey,
  RpcResponseAndContext,
  SignatureResult,
} from '@solana/web3.js'
import {
  Account,
  Adapter,
  CreateUserParams,
  FriendsEvents,
  User,
  Group,
} from '../../interfaces'
import { accountFromWallet, walletFromAccount } from './utils'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import FriendsProgram from '~/libraries/Solana/FriendsProgram/FriendsProgram'
import GroupChatsProgram from '~/libraries/Solana/GroupChatsProgram/GroupChatsProgram'
import {
  FriendAccount,
  FriendStatus,
} from '~/libraries/Solana/FriendsProgram/FriendsProgram.types'
import { AccountsError } from '~/store/accounts/types'
import UsersProgram from '~/libraries/Solana/UsersProgram/UsersProgram'

export default class SolanaAdapter implements Adapter {
  private readonly solanaManager: SolanaManager
  private usersProgram: UsersProgram | null = null
  private groupsProgram: GroupChatsProgram | null = null
  private _friendsProgram: FriendsProgram | null = null

  get friendsProgram(): FriendsProgram {
    if (this._friendsProgram) return this._friendsProgram
    if (this.solanaManager.isInitialized()) {
      this._friendsProgram = new FriendsProgram(this.solanaManager)
      return this._friendsProgram
    }

    throw new Error(
      'Unable to get FriendsProgram instance: Solana not initialized yet',
    )
  }

  constructor() {
    this.solanaManager = new SolanaManager()
    this.usersProgram = null
  }

  async initUserProgram(): Promise<void> {
    this.usersProgram = new UsersProgram(this.solanaManager)
  }

  async createRandomAccount(): Promise<Account> {
    const wallet = await this.solanaManager.createRandomKeypair()
    return accountFromWallet(wallet)
  }

  async createUser(params: CreateUserParams): Promise<boolean> {
    if (params.account) {
      await this.initSolanaManager(params.account)
      await this.initUserProgram()
      await this.usersProgram?.create(
        params.name,
        params.photoHash,
        params.status,
      )
      return true
    }
    return false
  }

  async getAccountBalance(account: Account): Promise<number | null> {
    await this.initSolanaManager(account)
    return this.solanaManager.getCurrentAccountBalance()
  }

  async getAccountFromMnemonic(mnemonic: string): Promise<Account | null> {
    await this.solanaManager.initializeFromMnemonic(mnemonic)
    const wallet = this.solanaManager.getMainSolanaWalletInstance()
    if (wallet) {
      return accountFromWallet(wallet)
    }
    return null
  }

  async requestAirdrop(): Promise<RpcResponseAndContext<SignatureResult> | null> {
    await this.solanaManager.requestAirdrop().then((out) => {
      return out
    })
    return null
  }

  private async initSolanaManager(account: Account) {
    await this.solanaManager.initializeFromSolanaWallet(
      walletFromAccount(account),
    )
  }

  private getAccounts(): {
    payerAccount: Keypair
    userAccount: Keypair
  } {
    const payerAccount = this.solanaManager.getActiveAccount()
    if (!payerAccount) {
      throw new Error(AccountsError.PAYER_NOT_PRESENT)
    }

    const userAccount = this.solanaManager.getUserAccount()
    if (!userAccount) {
      throw new Error(AccountsError.USER_DERIVATION_FAILED)
    }
    return {
      payerAccount,
      userAccount,
    }
  }

  async getUserInfo(address: string): Promise<User | null> {
    try {
      this.usersProgram = new UsersProgram(this.solanaManager)
      const e = await this.usersProgram.getUserInfo(address)
      return e
    } catch (e) {
      return null
    }
  }

  async getUsersInfo(addresses: string[]): Promise<User[]> {
    try {
      this.usersProgram = new UsersProgram(this.solanaManager)
      const users = await this.usersProgram.getUsersInfo(addresses)
      return users.map(
        (user) =>
          <User>{
            ...user,
          },
      )
    } catch (e) {
      throw new Error("Couldn't get users info")
    }
  }

  async getActiveAccount(): Promise<Keypair | undefined> {
    return this.solanaManager.getActiveAccount()
  }

  async getCurrentUserInfo(): Promise<User | null> {
    this.initUserProgram().then((usersProgram) => {
      if (this.usersProgram !== null) {
        this.usersProgram.getCurrentUserInfo().then((out) => {
          return out
        })
      }
    })
    return null
  }

  async getPayerAccount(): Promise<Keypair | undefined> {
    return this.solanaManager.payerAccount
  }

  async setPhotoHash(photoHash: string): Promise<string> {
    this.initUserProgram().then((usersProgram) => {
      if (this.usersProgram !== null) {
        this.usersProgram.setPhotoHash(photoHash).then((out) => {
          return out
        })
      }
    })
    return 'null'
  }

  async addEventListener(
    type: FriendsEvents,
    callback: (data?: FriendAccount) => void,
  ) {
    this.friendsProgram.addEventListener(type, callback)
  }

  async getFriendsByStatus(
    status: FriendStatus,
  ): Promise<{ incoming: FriendAccount[]; outgoing: FriendAccount[] }> {
    return await this.friendsProgram.getAccountsByStatus(status)
  }

  async subscribeToEvents(): Promise<void> {
    this.friendsProgram.subscribeToEvents()
  }

  async computeAccountKeys(
    from: PublicKey,
    to: PublicKey,
  ): Promise<{ request: PublicKey; first: PublicKey; second: PublicKey }> {
    return await this.friendsProgram.computeAccountKeys(from, to)
  }

  async getFriendsPayer(): Promise<Keypair> {
    return this.friendsProgram.getPayer()
  }

  async getAccountStatus(accountKey: PublicKey): Promise<FriendStatus> {
    return this.friendsProgram.getAccountStatus(accountKey)
  }

  async makeFriendRequest(
    request: PublicKey,
    first: PublicKey,
    second: PublicKey,
    k: String,
  ): Promise<string> {
    return await this.friendsProgram.makeRequest(request, first, second, k)
  }

  async getFriendAccount(accountKey: PublicKey): Promise<FriendAccount | null> {
    return await this.friendsProgram.getAccount(accountKey)
  }

  async acceptFriendRequest(request: PublicKey, k: String): Promise<string> {
    return await this.friendsProgram.acceptRequest(request, k)
  }

  async removeFriendRequest(request: PublicKey): Promise<string> {
    return await this.friendsProgram.removeRequest(request)
  }

  async denyFriendRequest(request: PublicKey): Promise<string> {
    return await this.friendsProgram.denyRequest(request)
  }

  async removeFriend(request: PublicKey): Promise<string> {
    return await this.friendsProgram.removeFriend(request)
  }

  closeFriendRequest(request: PublicKey): Promise<string> {
    return this.friendsProgram.closeRequest(request)
  }

  async createGroup(groupId: string, name: string): Promise<Group> {
    this.groupsProgram = new GroupChatsProgram(this.solanaManager)
    return await this.groupsProgram.create(groupId, name)
  }

  async getUserGroups(address: string | PublicKey): Promise<Group[]> {
    this.groupsProgram = new GroupChatsProgram(this.solanaManager)
    return await this.groupsProgram.getUserGroups(address)
  }

  async getGroupsUsers(
    groupIds: string[],
  ): Promise<{ id: string; users: string[] }[]> {
    this.groupsProgram = new GroupChatsProgram(this.solanaManager)
    return await this.groupsProgram.getGroupsUsers(groupIds)
  }

  async inviteToGroup(groupId: string, recipient: string): Promise<void> {
    this.groupsProgram = new GroupChatsProgram(this.solanaManager)
    await this.groupsProgram.invite(groupId, recipient)
  }

  async addGroupInviteListener(cb: (group: Group) => void): Promise<string> {
    this.groupsProgram = new GroupChatsProgram(this.solanaManager)
    return this.groupsProgram.addInviteListener(cb)
  }

  async unsubscribeGroupInviteListener(id: number): Promise<void> {
    this.groupsProgram = new GroupChatsProgram(this.solanaManager)
    return this.groupsProgram.unsubscribe(id)
  }

  async addGroupListener(
    id: string,
    cb: (value: Group) => void,
  ): Promise<string> {
    this.groupsProgram = new GroupChatsProgram(this.solanaManager)
    return this.groupsProgram.addGroupListener(id, cb)
  }

  async removeGroupListeners(keys: string[]): Promise<void> {
    this.groupsProgram = new GroupChatsProgram(this.solanaManager)
    return this.groupsProgram.removeGroupListeners(keys)
  }

  async getGroupById(id: string): Promise<Group> {
    this.groupsProgram = new GroupChatsProgram(this.solanaManager)
    return await this.groupsProgram.getGroupById(id)
  }

  async getGroupUsers(groupId: string): Promise<string[]> {
    this.groupsProgram = new GroupChatsProgram(this.solanaManager)
    return await this.groupsProgram.getGroupUsers(groupId)
  }

  async addGroupsListener(cb: (value: Group) => void): Promise<string[]> {
    this.groupsProgram = new GroupChatsProgram(this.solanaManager)
    return this.groupsProgram.addGroupsListener(cb)
  }
}
