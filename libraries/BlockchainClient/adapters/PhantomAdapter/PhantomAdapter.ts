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

export default class PhantomAdapter implements Adapter {
  private readonly $PhantomManager: PhantomManager = new PhantomManager()
  private phantomUser: PhantomUser | null = null
  private phantomFriend: PhantomFriend | null = null

  constructor() {
    this.$PhantomManager = new PhantomManager()
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

  async setPhotoHash(_photoHash: string): Promise<string> {
    return await this._getPhantomUser().setPhotoHash(_photoHash)
  }

  createRandomAccount(): Promise<Account | undefined> {
    throw new Error('Method not implemented.')
  }

  // here we don't need the mnemonic, since this function only triggers the wallet connection
  async getAccountFromMnemonic(_mnemonic?: string): Promise<Account | null> {
    try {
      this.$PhantomManager.initWallet()
      const account: Account = {
        address: this.$PhantomManager.getwalletPublicKey().toBase58(),
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
    throw new Error('Method not implemented..')
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

  getActiveAccount(): Promise<Keypair | undefined> {
    throw new Error('Method not implemented.')
  }

  async getCurrentUserInfo(): Promise<User | null> {
    return await this._getPhantomUser().getCurrentUserInfo()
  }

  async getUserInfo(_address: string): Promise<User | null> {
    return await this._getPhantomUser().getUserInfo(_address)
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

  getFriendsPayer(): Promise<Keypair> {
    throw new Error('Method not implemented.')
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

  getPayerAccount(): Promise<Keypair | undefined> {
    throw new Error('Method not implemented.')
  }

  createGroup(_groupId: string, _name: string): Promise<Group> {
    throw new Error('Method not implemented.')
  }

  getUserGroups(_address: string | PublicKey): Promise<Group[]> {
    throw new Error('Method not implemented.')
  }

  getGroupsUsers(
    _groupIds: string[],
  ): Promise<{ id: string; users: string[] }[]> {
    throw new Error('Method not implemented.')
  }

  inviteToGroup(_groupId: string, _recipient: string): Promise<void> {
    throw new Error('Method not implemented.')
  }

  addGroupInviteListener(_cb: (group: Group) => void): Promise<string> {
    throw new Error('Method not implemented.')
  }

  unsubscribeGroupInviteListener(_id: number): Promise<void> {
    throw new Error('Method not implemented.')
  }

  addGroupListener(_id: string, _cb: (value: Group) => void): Promise<string> {
    throw new Error('Method not implemented.')
  }

  removeGroupListeners(_keys: string[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  getGroupById(_id: string): Promise<Group> {
    throw new Error('Method not implemented.')
  }

  getGroupUsers(_groupId: string): Promise<string[]> {
    throw new Error('Method not implemented.')
  }

  addGroupsListener(_cb: (value: Group) => void): Promise<string[]> {
    throw new Error('Method not implemented.')
  }
}
