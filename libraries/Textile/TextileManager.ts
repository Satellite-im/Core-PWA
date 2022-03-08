import { Bucket } from '../Files/remote/textile/Bucket'
import { MetadataManager } from './MetadataManager'
import IdentityManager from '~/libraries/Textile/IdentityManager'
import { MailboxManager } from '~/libraries/Textile/MailboxManager'
import {
  Creds,
  TextileConfig,
  TextileInitializationData,
} from '~/types/textile/manager'
import BucketManager from '~/libraries/Textile/BucketManager'
import { GroupChatManager } from '~/libraries/Textile/GroupChatManager'
import { Config } from '~/config'

export default class TextileManager {
  creds?: Creds
  identityManager: IdentityManager
  mailboxManager?: MailboxManager
  bucketManager?: BucketManager
  bucket?: Bucket
  groupChatManager?: GroupChatManager
  metadataManager?: MetadataManager

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

    const textile: TextileInitializationData = {
      identity,
      client,
      wallet,
      users,
    }
    return this.authenticate(id, pass, textile)
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

    // Initialize bucket
    this.bucket = new Bucket(textile)
    await this.bucket.init(Config.textile.bucketName)

    // GroupChatManager initializes itself during the creation
    this.groupChatManager = new GroupChatManager(
      textile,
      textile.wallet.address,
      textile.identity,
    )

    // MetadataManager initializes itself during the creation
    this.metadataManager = new MetadataManager(textile)
    await this.metadataManager.init()
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
