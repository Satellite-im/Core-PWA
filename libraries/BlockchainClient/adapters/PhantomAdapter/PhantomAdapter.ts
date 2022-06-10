import {
  RpcResponseAndContext,
  SignatureResult,
  Keypair,
  PublicKey,
} from '@solana/web3.js'

import {
  Account,
  Adapter,
  CreateUserParams,
  FriendAccount,
  FriendsEvents,
  FriendStatus,
  Group,
  User,
} from '../../interfaces'

import PhantomManager from '~/libraries/Phantom/PhantomManager/PhantomManager'
import PhantomUser from '~/libraries/Phantom/PhantomUser/PhantomUser'
import PhantomFriend from '~/libraries/Phantom/PhantomFriend/PhantomFriend'
import PhantomGroup from '~/libraries/Phantom/PhantomGroup/PhantomGroup'

export default class PhantomAdapter implements Adapter {
  private readonly $PhantomManager: PhantomManager = new PhantomManager()
  private phantomUser: PhantomUser | null = null
  private phantomFriend: PhantomFriend | null = null
  private phantomGroup: PhantomGroup | null = null

  constructor() {
    this.$PhantomManager = new PhantomManager()
  }

  initUserProgram(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  initUserProgram(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  _getPhantomUser(): PhantomUser {
    if (!this.phantomUser) {
      if (this.$PhantomManager.getAdapter().connected) {
        this.phantomUser = new PhantomUser(this.$PhantomManager)
        return this.phantomUser
      }
      throw new Error('Phantom user is not initialized')
    }
    return this.phantomUser
  }

  _getPhantomFriend(): PhantomFriend {
    if (!this.phantomFriend) {
      if (this.$PhantomManager.getAdapter().connected) {
        this.phantomFriend = new PhantomFriend(this.$PhantomManager)
        return this.phantomFriend
      }
      throw new Error('Phantom friend is not initialized')
    }
    return this.phantomFriend
  }

  _getPhantomGroup(): PhantomGroup {
    if (!this.phantomGroup) {
      if (this.$PhantomManager.getAdapter().connected) {
        this.phantomGroup = new PhantomGroup(this.$PhantomManager)
        return this.phantomGroup
      }
      throw new Error('Phantom group is not initialized')
    }
    return this.phantomGroup
  }

  _getConnectionStatus(): boolean {
    return this.$PhantomManager.$PhantomWalletAdapter.connected
  }

  async setPhotoHash(_photoHash: string): Promise<string> {
    return await this._getPhantomUser().setPhotoHash(_photoHash)
  }

  createRandomAccount(): Promise<Account | undefined> {
    throw new Error('Method not implemented.')
  }

  // here we don't need the mnemonic, since this function only triggers the wallet connection
  async getAccountFromMnemonic(_mnemonic?: string): Promise<Account | null> {
    try {
      await this.$PhantomManager.initWallet()
      const account: Account = {
        address: this.$PhantomManager.getwalletPublicKey().toBase58(),
        publicKey: this.$PhantomManager.getwalletPublicKey(),
      }
      return account
    } catch (e) {
      return null
    }
  }

  async getAccountBalance(_account: Account): Promise<number | null> {
    return await this.$PhantomManager.getCurrentAccountBalance()
  }

  requestAirdrop(): Promise<RpcResponseAndContext<SignatureResult> | null> {
    throw new Error('This method dose not exist in Phantom')
  }

  async createUser(_params: CreateUserParams): Promise<boolean> {
    if (_params) {
      this._getPhantomUser().create(
        _params.name,
        _params.photoHash,
        _params.status,
      )
      return true
    }
    return false
  }

  async getActiveAccount(): Promise<Account | undefined> {
    if (this._getConnectionStatus()) {
      return {
        address: this.$PhantomManager.getwalletPublicKey().toBase58(),
        publicKey: this.$PhantomManager.getwalletPublicKey(),
      }
    }
    return undefined
  }

  async getCurrentUserInfo(): Promise<User | null> {
    return await this._getPhantomUser().getCurrentUserInfo()
  }

  async getUserInfo(_address: string): Promise<User | null> {
    try {
      const e = await this._getPhantomUser().getUserInfo(_address)
      return e
    } catch (e) {
      return null
    }
  }

  async getUsersInfo(_addresses: string[]): Promise<User[]> {
    try {
      const users = await this._getPhantomUser().getUsersInfo(_addresses)
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

  async getFriendsByStatus(
    _status: FriendStatus,
  ): Promise<{ incoming: FriendAccount[]; outgoing: FriendAccount[] }> {
    return await this._getPhantomFriend().getAccountsByStatus(_status)
  }

  async subscribeToEvents(): Promise<void> {
    this._getPhantomFriend().subscribeToEvents()
  }

  addEventListener(
    _type: FriendsEvents,
    _callback: (data?: FriendAccount | undefined) => void,
  ): void {
    this._getPhantomFriend().addEventListener(_type, _callback)
  }

  async computeAccountKeys(
    _from: PublicKey,
    _to: PublicKey,
  ): Promise<{ request: PublicKey; first: PublicKey; second: PublicKey }> {
    return this._getPhantomFriend().computeAccountKeys(_from, _to)
  }

  async getFriendsPayer(): Promise<Account> {
    const account = await this.getActiveAccount()
    if (!account) throw new Error('No account found')
    return account
  }

  getAccountStatus(_accountKey: PublicKey): Promise<FriendStatus> {
    return this._getPhantomFriend().getAccountStatus(_accountKey)
  }

  async makeFriendRequest(
    _request: PublicKey,
    _first: PublicKey,
    _second: PublicKey,
    _k: String,
  ): Promise<string> {
    return await this._getPhantomFriend().makeRequest(
      _request,
      _first,
      _second,
      _k,
    )
  }

  async getFriendAccount(
    _accountKey: PublicKey,
  ): Promise<FriendAccount | null> {
    return await this._getPhantomFriend().getAccount(_accountKey)
  }

  async acceptFriendRequest(_request: PublicKey, _k: String): Promise<string> {
    return await this._getPhantomFriend().acceptRequest(_request, _k)
  }

  async denyFriendRequest(_request: PublicKey): Promise<string> {
    return await this._getPhantomFriend().denyRequest(_request)
  }

  async removeFriendRequest(_request: PublicKey): Promise<string> {
    return await this._getPhantomFriend().removeRequest(_request)
  }

  async removeFriend(_request: PublicKey): Promise<string> {
    return await this._getPhantomFriend().removeFriend(_request)
  }

  async closeFriendRequest(_request: PublicKey): Promise<string> {
    return await this._getPhantomFriend().closeRequest(_request)
  }

  async getPayerAccount(): Promise<Account | undefined> {
    return await this.getActiveAccount()
  }

  async createGroup(_groupId: string, _name: string): Promise<Group> {
    return await this._getPhantomGroup().create(_groupId, _name)
  }

  async getUserGroups(_address: string | PublicKey): Promise<Group[]> {
    return await this._getPhantomGroup().getUserGroups(_address)
  }

  async getGroupsUsers(
    _groupIds: string[],
  ): Promise<{ id: string; users: string[] }[]> {
    return await this._getPhantomGroup().getGroupsUsers(_groupIds)
  }

  async inviteToGroup(_groupId: string, _recipient: string): Promise<void> {
    return await this._getPhantomGroup().invite(_groupId, _recipient)
  }

  async addGroupInviteListener(_cb: (group: Group) => void): Promise<string> {
    return this._getPhantomGroup().addInviteListener(_cb)
  }

  unsubscribeGroupInviteListener(_id: number): Promise<void> {
    return this._getPhantomGroup().unsubscribe(_id)
  }

  async addGroupListener(
    _id: string,
    _cb: (value: Group) => void,
  ): Promise<string> {
    return this._getPhantomGroup().addGroupListener(_id, _cb)
  }

  removeGroupListeners(_keys: string[]): Promise<void> {
    return this._getPhantomGroup().removeGroupListeners(_keys)
  }

  getGroupById(_id: string): Promise<Group> {
    return this._getPhantomGroup().getGroupById(_id)
  }

  getGroupUsers(_groupId: string): Promise<string[]> {
    return this._getPhantomGroup().getGroupUsers(_groupId)
  }

  addGroupsListener(_cb: (value: Group) => void): Promise<string[]> {
    return this._getPhantomGroup().addGroupsListener(_cb)
  }
}
