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

export default class PhantomAdapter implements Adapter {
  private readonly phantomManager: PhantomManager
  private phantomUser: PhantomUser | null = null

  constructor(phantomManager: PhantomManager) {
    this.phantomManager = phantomManager
  }

  _getPhantomUser(): PhantomUser {
    if (!this.phantomUser) {
      if (this.phantomManager.getAdapter().connected) {
        this.phantomUser = new PhantomUser(this.phantomManager)
        return this.phantomUser
      }
      throw new Error('Phantom user is not initialized')
    }
    return this.phantomUser
  }

  async setPhotoHash(_photoHash: string): Promise<string> {
    return await this._getPhantomUser().setPhotoHash(_photoHash)
  }

  createRandomAccount(): Promise<Account | undefined> {
    throw new Error('Method not implemented.')
  }

  getAccountFromMnemonic(_mnemonic: string): Promise<Account | null> {
    throw new Error('Method not implemented.')
  }

  async getAccountBalance(_account: Account): Promise<number | null> {
    return await this.phantomManager.getCurrentAccountBalance()
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

  getFriendsByStatus(
    _status: FriendStatus,
  ): Promise<{ incoming: FriendAccount[]; outgoing: FriendAccount[] }> {
    throw new Error('Method not implemented.')
  }

  subscribeToEvents(): Promise<void> {
    throw new Error('Method not implemented.')
  }

  addEventListener(
    _type: FriendsEvents,
    _callback: (data?: FriendAccount | undefined) => void,
  ): void {
    throw new Error('Method not implemented.')
  }

  computeAccountKeys(
    _from: PublicKey,
    _to: PublicKey,
  ): Promise<{ request: PublicKey; first: PublicKey; second: PublicKey }> {
    throw new Error('Method not implemented.')
  }

  getFriendsPayer(): Promise<Keypair> {
    throw new Error('Method not implemented.')
  }

  getAccountStatus(_accountKey: PublicKey): Promise<FriendStatus> {
    throw new Error('Method not implemented.')
  }

  makeFriendRequest(
    _request: PublicKey,
    _first: PublicKey,
    _second: PublicKey,
    _k: String,
  ): Promise<string> {
    throw new Error('Method not implemented.')
  }

  getFriendAccount(_accountKey: PublicKey): Promise<FriendAccount | null> {
    throw new Error('Method not implemented.')
  }

  acceptFriendRequest(_request: PublicKey, _k: String): Promise<string> {
    throw new Error('Method not implemented.')
  }

  denyFriendRequest(_request: PublicKey): Promise<string> {
    throw new Error('Method not implemented.')
  }

  removeFriendRequest(_request: PublicKey): Promise<string> {
    throw new Error('Method not implemented.')
  }

  removeFriend(_request: PublicKey): Promise<string> {
    throw new Error('Method not implemented.')
  }

  closeFriendRequest(_request: PublicKey): Promise<string> {
    throw new Error('Method not implemented.')
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
