import {
  Keypair,
  PublicKey,
  RpcResponseAndContext,
  SignatureResult,
} from '@solana/web3.js'
import {
  Account,
  Adapter,
  FriendAccount,
  FriendsEvents,
  FriendStatus,
  Group,
  User,
} from './interfaces'

export default class BlockchainClient {
  private static instance: BlockchainClient // eslint-disable-line no-use-before-define
  private adapter: Adapter | null = null
  private _account?: Account
  private _payerAccount?: Account

  public static getInstance(): BlockchainClient {
    if (!BlockchainClient.instance) {
      BlockchainClient.instance = new BlockchainClient()
    }

    return BlockchainClient.instance
  }

  /**
   * @method _setAdapter
   * Set adapter
   * @param {Adapter} adapter
   * @returns {void}
   **/
  setAdapter(adapter: Adapter): void {
    this.adapter = adapter
  }

  /**
   * @method _getAdapter
   * Get adapter
   * @returns {Adapter}
   */
  _getAdapter(): Adapter {
    if (!this.adapter) {
      throw new Error('Adapter is not set')
    }
    return this.adapter
  }

  /**
   * @method signMessage
   * Sign message
   * @param {string} message
   * @returns {Promise<Uint8Array>} signature
   */
  async signMessage(message: string): Promise<Uint8Array> {
    return this._getAdapter().signMessage(message)
  }

  /**
   * @method getAccount
   * Returns the main account as an Account object
   * @returns {Account}
   * @throws {Error} if account is not initialized
   */
  get account(): Account {
    if (!this._account) {
      throw new Error('Account is not initialized')
    }
    return this._account
  }

  /**
   * @method getPayerAccount
   * Returns the main account as a Account object
   * @returns {Account}
   * @throws {Error} if account is not initialized
   * */
  get payerAccount(): Account {
    if (!this._payerAccount) {
      throw new Error('PayerAccount is not initialized')
    }
    return this._payerAccount
  }

  get isInitialized(): boolean {
    return !!this._account
  }

  get isPayerInitialized(): boolean {
    return !!this._payerAccount
  }

  /**
   * @method initFromMnemonic
   * Initialize client from account with mnemonic
   * @param {string} mnemonic
   * @returns {Promise<void>}
   */
  async initFromMnemonic(mnemonic?: string): Promise<void> {
    await this._getAdapter()
      .getAccountFromMnemonic(mnemonic)
      .then((account) => {
        if (account) {
          this._account = account
        }
      })
    await this._getAdapter()
      .getPayerAccount()
      .then((account) => {
        if (account) {
          this._payerAccount = account
        }
      })
  }

  /**
   * @method initRandom
   * Create random account and initialize client
   * @returns {Promise<void>}
   */
  async initRandom(): Promise<void> {
    this._account = await this._getAdapter().createRandomAccount()
  }

  /**
   * @method createUser
   * Create user
   * @param {string} name username
   * @param {string} photoHash profile picture IPFS hash
   * @param {string} status status string
   * @returns {Promise<boolean>}
   */
  async createUser(
    name: string,
    photoHash: string,
    status: string,
  ): Promise<boolean> {
    return this._getAdapter().createUser({
      name,
      photoHash,
      status,
      account: this.account,
    })
  }

  /**
   * @method setPhotoHash
   * Set photo hash
   * @param {string} photoHash profile picture IPFS hash
   */
  async setPhotoHash(photoHash: string): Promise<string> {
    return this._getAdapter().setPhotoHash(photoHash)
  }

  /**
   * @method getUser
   * Get user by address
   * @param {string} address
   * @returns {Promise<User>} user object
   */
  getUser(address: string): Promise<User | null> {
    return this._getAdapter().getUserInfo(address)
  }

  /**
   *  @method getUsersInfo
   * @param addresses[] list of adrresses to lookup
   * @returns User[]
   */
  getUsersInfo(addresses: string[]): Promise<User[]> {
    return this._getAdapter().getUsersInfo(addresses)
  }

  /**
   * @method getConnectionStatus
   * Gets connection status, principally used with phantom wallet
   * @returns boolean
   */
  getConnectionStatus(): boolean {
    return this._getAdapter()._getConnectionStatus()
  }

  /**
   * @method getCurrentUser
   * Get current user
   * @returns {Promise<User>} user object
   */
  async getCurrentUser(): Promise<User | null> {
    return this._getAdapter().getUserInfo(this.account.address)
  }

  /**
   * @method getBalance
   * Get balance for current account
   * @returns {Promise<number | null>} balance amount or null
   */
  async getBalance(): Promise<number | null> {
    return this._getAdapter().getAccountBalance(this.account)
  }

  /**
   * @method requestAirdrop
   * Request airdrop
   * @param
   * @returns {Promise<RpcResponseAndContext<SignatureResult> | null>}
   */
  async requestAirdrop(): Promise<RpcResponseAndContext<SignatureResult> | null> {
    return this._getAdapter().requestAirdrop()
  }

  /**
   * @method getCurrentUserInfo
   * Get current user info
   * @param
   * @returns {Promise<User | null>}
   */
  async getCurrentUserInfo(): Promise<User | null> {
    return this._getAdapter().getUserInfo(this.account.address)
  }

  initUserProgram(): Promise<void> {
    return this._getAdapter().initUserProgram()
  }

  /**
   * @method getUserInfo
   * Get user info
   * @param {string} userAddress
   * @returns {Promise<User | null>}
   * */
  async getUserInfo(userAddress: string): Promise<User | null> {
    return this._getAdapter().getUserInfo(userAddress)
  }

  /**
   * @method addFriendEventListener
   * Add event listener
   * @param {string} eventName
   * @param callback
   * @returns {Promise<void>}
   */
  async addFriendEventListener(
    type: FriendsEvents,
    callback: (data?: FriendAccount) => void,
  ): Promise<void> {
    await this._getAdapter().addEventListener(type, callback)
  }

  /**
   * @method getFriendsByStatus
   * Get friends by status
   * @param {FriendStatus} status
   * @returns {Promise<FriendAccount[]>}
   */
  async getFriendsByStatus(
    status: FriendStatus,
  ): Promise<{ incoming: FriendAccount[]; outgoing: FriendAccount[] }> {
    return this._getAdapter().getFriendsByStatus(status)
  }

  /**
   *  @method subscribeToEvents
   *  Subscribe to events
   */
  subscribeToEvents(): void {
    this._getAdapter().subscribeToEvents()
  }

  /**
   * @method computeAccountKeys
   * Computes the friend account public key from 2 given public keys
   * @param from the public key to be used at position 0
   * @param to the public key to be used at position 1
   * @returns the computed public key
   */
  async computeAccountKeys(
    from: PublicKey,
    to: PublicKey,
  ): Promise<{ request: PublicKey; first: PublicKey; second: PublicKey }> {
    return this._getAdapter().computeAccountKeys(from, to)
  }

  /**
   * @method getFriendsPayer
   * Retrieve the active account from Solana wallet
   * @returns the payer account
   */
  async getFriendsPayer(): Promise<Account> {
    return this._getAdapter().getFriendsPayer()
  }

  /**
   * @method getAccountStatus
   * @param accountKey
   * @returns {Promise<FriendStatus>}
   */
  async getAccountStatus(accountKey: PublicKey): Promise<FriendStatus> {
    return this._getAdapter().getAccountStatus(accountKey)
  }

  /**
   * @method makeFriendRequest
   * make friend request
   * @param request
   * @param first
   * @param second
   * @param k
   * @return {Promise<string> }
   */
  async makeFriendRequest(
    request: PublicKey,
    first: PublicKey,
    second: PublicKey,
    k: String,
  ): Promise<string> {
    return this._getAdapter().makeFriendRequest(request, first, second, k)
  }

  /**
   * @method getFriendAccount
   * Retrieves a friend account from a given public key
   * @param accountKey the public key of the friend account
   * @returns the raw friend account object
   */
  async getFriendAccount(accountKey: PublicKey): Promise<FriendAccount | null> {
    return this._getAdapter().getFriendAccount(accountKey)
  }

  /**
   * @method acceptFriendRequest
   * Accept friend request
   * @param request friend request account public key
   * @param k textile encryption key for recipient
   * @returns transaction hash of accept friend request
   */
  async acceptFriendRequest(request: PublicKey, k: String): Promise<string> {
    return this._getAdapter().acceptFriendRequest(request, k)
  }

  /**
   * @method removeFriendRequest
   * Remove friend request
   * @param request friend request account public key
   */
  async removeFriendRequest(request: PublicKey): Promise<string> {
    return this._getAdapter().removeFriendRequest(request)
  }

  /**
   * @method denyFriendRequest
   * Deny friend request
   * @param request friend request account public key
   * @returns transaction hash string of deny friend request
   */
  async denyFriendRequest(request: PublicKey): Promise<string> {
    return this._getAdapter().denyFriendRequest(request)
  }

  /**
   * @method removeFriend
   * Remove friend
   * @param request friend request account public key
   */
  async removeFriend(friend: PublicKey): Promise<string> {
    return this._getAdapter().removeFriend(friend)
  }

  /**
   * @method closeFriendRequest
   * Close friend request from sender's side
   * @param request friend request account public key
   */
  async closeFriendRequest(request: PublicKey): Promise<string> {
    return this._getAdapter().closeFriendRequest(request)
  }

  /**
   * @method createGroup
   *Create a group
   * @param groupId Group id
   * @param name Group name
   */
  async createGroup(groupId: string, name: string): Promise<Group> {
    return this._getAdapter().createGroup(groupId, name)
  }

  /**
   * @method getUserGroups
   * Returns groups the user is a member of
   * @param address {string} user address
   * @returns Promise<Group[]>
   */
  async getUserGroups(address: string | PublicKey): Promise<Group[]> {
    return this._getAdapter().getUserGroups(address)
  }

  async getGroupsUsers(
    groupIds: string[],
  ): Promise<{ id: string; users: string[] }[]> {
    return this._getAdapter().getGroupsUsers(groupIds)
  }

  /**
   * @method invite
   * Invite new user into Group
   * @param groupId group id
   * @param recipient: recipient address
   */
  async inviteToGroup(groupId: string, recipient: string): Promise<void> {
    await this._getAdapter().inviteToGroup(groupId, recipient)
  }

  /**
   * @method addGroupInviteListener
   * Register event listener for new group invites
   * @param cb
   */
  async addGroupInviteListener(cb: (group: Group) => void): Promise<string> {
    return this._getAdapter().addGroupInviteListener(cb)
  }

  /**
   * @method unsubscribeGroupInviteListener
   * Unsubscribe from group invite events
   * @param id {number} event subscription id
   * @returns Promise<void>
   */
  async unsubscribeGroupInvite(id: number): Promise<void> {
    return this._getAdapter().unsubscribeGroupInviteListener(id)
  }

  /**
   * @method addGroupListener
   * Register event listener for group updates
   * @param id
   * @param cb
   * @returns Promise<string>
   */
  async addGroupListener(
    id: string,
    cb: (value: Group) => void,
  ): Promise<string> {
    return this._getAdapter().addGroupListener(id, cb)
  }

  /**
   * Remove group updates listeners
   * @param keys
   */
  async removeGroupListeners(keys: string[]): Promise<void> {
    return this._getAdapter().removeGroupListeners(keys)
  }

  /**
   * @method getGroupById
   * get group by id
   * @param groupId
   * @returns Promise<Group>
   */
  async getGroupById(groupId: string): Promise<Group> {
    return this._getAdapter().getGroupById(groupId)
  }

  /**
   * Returns members of given group
   * @param groupId {string} group id
   * @returns Promise<string[]> array of user addresses
   */
  async getGroupUsers(groupId: string): Promise<string[]> {
    return this._getAdapter().getGroupUsers(groupId)
  }

  /**
   * Register event listener for group updates
   * @param cb
   * @returns {string[]} array of addresses for unsubscribe
   */
  addGroupsListener(cb: (value: Group) => void): Promise<string[]> {
    return this._getAdapter().addGroupsListener(cb)
  }
}
