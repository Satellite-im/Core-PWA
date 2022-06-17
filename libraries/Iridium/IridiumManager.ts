import { Iridium } from '@satellite-im/iridium/dist/index.browser'
import { Account } from '~/libraries/BlockchainClient/interfaces'
import IdentityManager from '~/libraries/Iridium/IdentityManager'
import GroupManager from '~/libraries/Iridium/groups/GroupManager'
import ProfileManager from '~/libraries/Iridium/profile/ProfileManager'
import ChatManager from '~/libraries/Iridium/chat/ChatManager'
import FriendsManager from '~/libraries/Iridium/friends/FriendsManager'
import logger from '~/plugins/local/logger'

export class IridiumManager {
  ready: boolean = false
  connector?: Iridium
  profile?: ProfileManager
  groups?: GroupManager
  chat?: ChatManager
  friends?: FriendsManager

  /**
   * @method
   * Initialization function that creates a Textile identity
   * and initializes the Mailbox
   * @param param0 Textile Configuration that includes id, password and SolanaWallet instance
   * @returns a promise that resolves when the initialization completes
   */
  async init({ pass, wallet }: { pass: string; wallet: Account }) {
    logger.log('iridium/manager', 'init()')
    if (!wallet) {
      throw new Error('Iridium requires a wallet for initialization (for now)')
    }

    const seed = await IdentityManager.seedFromWallet(pass, wallet)
    this.connector = await Iridium.fromSeed(seed)

    logger.log('iridium/manager', 'connector initialized', {
      id: this.connector.id,
      peerId: this.connector.peerId,
    })

    logger.log('iridium/manager', 'starting IPFS')
    await this.connector.start()

    // check for existing root document
    await this.connector.get('/').catch(() => {
      // we don't have a recoverable root document, so create one
      logger.log('iridium/manager', 'creating root document')
      return this.connector.set('/')
    })

    const doc = (await this.connector.get('/')) || {}
    if (!doc.id) {
      Object.assign(doc, {
        id: this.connector.id,
        profile: { name: 'guest' },
        groups: {},
        friends: {},
        conversations: {},
        files: {},
        settings: {},
        indexes: {},
      })
    }
    doc.seen = Date.now()
    await this.connector.set('/', doc, {
      encrypt: { recipients: [this.connector.id] },
    })
    logger.log('iridium/manager', 'loaded root document', doc)

    logger.log('iridium/manager', 'initializing profile')
    this.profile = new ProfileManager(this)
    logger.log('iridium/friends', 'initializing friends')
    this.friends = new FriendsManager(this)
    logger.log('iridium/manager', 'initializing groups')
    this.groups = new GroupManager(this)
    logger.log('iridium/manager', 'initializing chat')
    this.chat = new ChatManager(this)

    logger.log('iridium/manager', 'ready')
    this.ready = true
  }
}

const instance = new IridiumManager()
export default instance
