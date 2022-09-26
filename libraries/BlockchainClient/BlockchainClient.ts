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
   * @method getConnectionStatus
   * Gets connection status, principally used with phantom wallet
   * @returns boolean
   */
  getConnectionStatus(): boolean {
    return this._getAdapter()._getConnectionStatus()
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
}
