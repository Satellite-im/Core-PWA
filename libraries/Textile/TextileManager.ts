import { MetadataManager } from './MetadataManager'
import { UserInfoManager } from './UserManager'
import { Config } from '~/config'
import { PersonalBucket } from '~/libraries/Files/remote/textile/PersonalBucket'
import { SharedBucket } from '~/libraries/Files/remote/textile/SharedBucket'
import { GroupChatManager } from '~/libraries/Textile/GroupChatManager'
import IdentityManager from '~/libraries/Textile/IdentityManager'
import { MailboxManager } from '~/libraries/Textile/MailboxManager'
import { NotificationManager } from '~/libraries/Textile/NotificationManager'
import {
  Creds,
  TextileConfig,
  TextileInitializationData,
} from '~/types/textile/manager'

export default class TextileManager {
  creds?: Creds
  identityManager: IdentityManager
  mailboxManager?: MailboxManager
  personalBucket?: PersonalBucket
  sharedBucket?: SharedBucket
  groupChatManager?: GroupChatManager
  metadataManager?: MetadataManager
  userInfoManager?: UserInfoManager
  notificationManager?: NotificationManager

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
    this.sharedBucket = new SharedBucket(textile)
    this.personalBucket = new PersonalBucket(textile)
    // GroupChatManager initializes itself during the creation
    this.groupChatManager = new GroupChatManager(
      textile,
      textile.wallet.address,
      textile.identity,
    )
    // MetadataManager initializes itself during the creation
    this.metadataManager = new MetadataManager(textile)
    // UserInfoManager initializes itself during the creation
    this.userInfoManager = new UserInfoManager(textile)
    this.notificationManager = new NotificationManager(textile)

    // await all the managers to be initialized
    await Promise.all([
      this.mailboxManager.init(),
      this.sharedBucket.init({
        name: Config.textile.sharedBucket,
      }),
      this.personalBucket.init({
        name: Config.textile.personalBucket,
        encrypted: true,
      }),
      this.groupChatManager.init(),
      this.metadataManager.init(),
      this.userInfoManager.init(),
      this.notificationManager.init(),
    ])
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
