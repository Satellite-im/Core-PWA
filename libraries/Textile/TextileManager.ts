import IdentityManager from '~/libraries/Textile/IdentityManager'
import { MailboxManager } from '~/libraries/Textile/MailboxManager'
import {
  Creds,
  TextileConfig,
  TextileInitializationData,
} from '~/types/textile/manager'
import BucketManager from '~/libraries/Textile/BucketManager'
import ThreadManager from '~/libraries/Textile/ThreadManager'

export default class TextileManager {
  creds?: Creds
  identityManager: IdentityManager
  mailboxManager?: MailboxManager
  bucketManager?: BucketManager
  threadManager?: ThreadManager

  constructor() {
    this.identityManager = new IdentityManager()
  }

  /**
   * @method
   * Initialization function that creates a Textile identity
   * and initializes the Mailbox
   * @param param0 Textile Configuration that includes id, password and SolanaWallet instance
   * @returns a promise that resolves when the initialization completes
   */
  async init({ id, pass, wallet }: TextileConfig) {
    if (!wallet) {
      throw new Error('Wallet is mandatory for textile')
    }

    const identity = await this.identityManager.initFromWallet(wallet)

    const { client, users } = await this.identityManager.authorize(identity)

    this.creds = {
      id,
      pass,
    }

    const textile: TextileInitializationData = {
      identity,
      client,
      wallet,
      users,
    }

    this.mailboxManager = new MailboxManager(textile, wallet.address)
    this.bucketManager = new BucketManager(
      textile,
      identity,
      textile.wallet.address,
    )
    this.threadManager = new ThreadManager(
      textile,
      textile.wallet.address,
      identity,
    )
    await this.bucketManager.init().catch((e) => console.log(e))
    return this.mailboxManager.init()
  }

  /**
   * @method
   * Used to authenticate connections and encrypt data
   * @argument id identity
   * @argument pass password
   */
  async authenticate(
    id: string,
    pass: string,
    textile: TextileInitializationData,
  ) {
    this.creds = {
      id,
      pass,
    }

    this.mailboxManager = new MailboxManager(textile, textile.wallet.address)
    await this.mailboxManager.init()
    this.bucketManager = new BucketManager(
      textile,
      textile.identity,
      textile.wallet.address,
    )
    await this.bucketManager.init().catch((e) => console.log(e))
    this.threadManager = new ThreadManager(
      textile,
      textile.wallet.address,
      textile.identity,
    )
    await this.threadManager.init().catch((e) => console.log(e))
  }

  /**
   * @method
   * Returns the identity public key if exists
   * throws an error otherwise
   * @returns the identity public key
   */
  getIdentityPublicKey() {
    return this.identityManager?.identity?.public?.toString() || null
  }
}
