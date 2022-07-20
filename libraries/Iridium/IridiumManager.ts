import { Emitter, createIridiumIPFS } from '@satellite-im/iridium'
import type { IridiumIPFS } from '@satellite-im/iridium'
import { Account } from '~/libraries/BlockchainClient/interfaces'
import IdentityManager from '~/libraries/Iridium/IdentityManager'
import GroupManager from '~/libraries/Iridium/groups/GroupManager'
import ProfileManager from '~/libraries/Iridium/profile/ProfileManager'
import ChatManager from '~/libraries/Iridium/chat/ChatManager'
import FriendsManager from '~/libraries/Iridium/friends/FriendsManager'
import logger from '~/plugins/local/logger'
import { Config } from '~/config'
import FilesManager from '~/libraries/Iridium/files/FilesManager'
import SettingsManager from '~/libraries/Iridium/settings/SettingsManager'
import NotificationManager from '~/libraries/Iridium/NotificationManager'

export class IridiumManager extends Emitter {
  ready: boolean = false
  connector?: IridiumIPFS
  profile: ProfileManager
  groups: GroupManager
  chat: ChatManager
  friends: FriendsManager
  files: FilesManager
  notifications: NotificationManager
  settings: SettingsManager

  constructor() {
    super()
    this.profile = new ProfileManager(this)
    this.groups = new GroupManager(this)
    this.friends = new FriendsManager(this)
    this.chat = new ChatManager(this)
    this.files = new FilesManager(this)
    this.settings = new SettingsManager(this)
    this.notifications = new NotificationManager(this)
  }

  /**
   * @method
   * Initialization function that creates a Textile identity
   * and initializes the Mailbox
   * @param param0 Textile Configuration that includes id, password and SolanaWallet instance
   * @returns a promise that resolves when the initialization completes
   */
  async init({ pass, wallet }: { pass: string; wallet: Account }) {
    logger.log('iridium/manager', 'init()')
    const seed = await IdentityManager.seedFromWallet(pass, wallet)
    return this.initFromEntropy(seed)
  }

  /**
   * @method
   * Initialization function that creates a Textile identity
   * and initializes the Mailbox
   * @param param0 Textile Configuration that includes id, password and SolanaWallet instance
   * @returns a promise that resolves when the initialization completes
   */
  async initFromEntropy(entropy: Uint8Array) {
    logger.log('iridium/manager', 'initFromEntropy()')
    this.connector = await createIridiumIPFS(entropy, {
      logger,
      nodes: Config.iridium.syncNodes,
    })

    logger.log('iridium/manager', 'connector initialized', {
      id: this.connector.id,
    })

    logger.log('iridium/manager', 'starting IPFS')
    await this.connector.start()

    // check for existing root document
    let doc = (await this.connector.get('/')) || {}
    if (!doc.id) {
      logger.log('iridium/manager', 'creating new root document', doc)
      doc = {
        id: this.connector.id,
        profile: { name: 'guest' },
        groups: {},
        friends: {},
        conversations: {},
        files: {},
        notifications: {},
        settings: {},
        indexes: {},
      }
    } else {
      logger.log('iridium/manager', 'loaded root document', doc)
    }
    doc.seen = Date.now()
    await this.connector.set('/', doc)

    logger.log('iridium/manager', 'initializing profile')
    await this.profile.init()
    logger.log('iridium/manager', 'initializing groups')
    await this.groups.init()
    logger.log('iridium/friends', 'initializing friends')
    await this.friends.init()
    logger.log('iridium/manager', 'initializing chat')
    await this.chat.init()
    logger.log('iridium/manager', 'initializing files')
    await this.files.init()
    logger.log('iridium/manager', 'initializing settings')
    await this.settings.init()
    logger.log('iridium/manager', 'notification settings')
    await this.notifications.init()
    logger.log('iridium/manager', 'ready')

    this.ready = true
  }
}

const instance = new IridiumManager()
export default instance
