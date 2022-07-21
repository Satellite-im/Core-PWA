import { Iridium, Emitter } from '@satellite-im/iridium'
import { Account } from '~/libraries/BlockchainClient/interfaces'
import IdentityManager from '~/libraries/Iridium/IdentityManager'
import GroupManager from '~/libraries/Iridium/groups/GroupManager'
import ProfileManager from '~/libraries/Iridium/profile/ProfileManager'
import ChatManager from '~/libraries/Iridium/chat/ChatManager'
import FriendsManager from '~/libraries/Iridium/friends/FriendsManager'
import logger from '~/plugins/local/logger'
import { Config } from '~/config'
import FilesManager from '~/libraries/Iridium/files/FilesManager'
import WebRTCManager from '~/libraries/Iridium/webrtc/WebRTCManager'
import SettingsManager from '~/libraries/Iridium/settings/SettingsManager'
import Crypto from '~/libraries/Crypto/Crypto'

export class IridiumManager extends Emitter {
  ready: boolean = false
  connector?: Iridium
  profile: ProfileManager
  groups: GroupManager
  chat: ChatManager
  friends: FriendsManager
  files: FilesManager
  webRTC: WebRTCManager
  settings: SettingsManager

  constructor() {
    super()
    this.profile = new ProfileManager(this)
    this.groups = new GroupManager(this)
    this.friends = new FriendsManager(this)
    this.chat = new ChatManager(this)
    this.files = new FilesManager(this)
    this.webRTC = new WebRTCManager(this)
    this.settings = new SettingsManager(this)
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
    if (!wallet) {
      throw new Error('Iridium requires a wallet for initialization (for now)')
    }

    const seed = await IdentityManager.seedFromWallet(pass, wallet)
    this.connector = await Iridium.fromSeed(seed, {
      logger,
      config: {
        syncNodes: Config.iridium.syncNodes,
        ipfs: Config.iridium.ipfs,
      },
    })

    logger.log('iridium/manager', 'connector initialized', {
      id: this.connector.id,
      peerId: this.connector.peerId,
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
    logger.log('iridium/manager', 'initializing webRTC')
    await this.webRTC.init()
    logger.log('iridium/manager', 'initializing settings')
    await this.settings.init()
    logger.log('iridium/manager', 'ready')

    this.ready = true
  }

  /**
   * @method
   * Initialization function that creates a Textile identity
   * and initializes the Mailbox
   * @param param0 Textile Configuration that includes id, password and SolanaWallet instance
   * @returns a promise that resolves when the initialization completes
   */
  async initFromEntropy(entropy: Uint8Array) {
    logger.log('iridium/manager', 'init()')
    if (!entropy) {
      throw new Error('Entropy not valid')
    }

    const seed = await Crypto.sha256(entropy)
    this.connector = await Iridium.fromSeed(seed, {
      logger,
      config: {
        syncNodes: Config.iridium.syncNodes,
        ipfs: Config.iridium.ipfs,
      },
    })

    logger.log('iridium/manager', 'connector initialized', {
      id: this.connector.id,
      peerId: this.connector.peerId,
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
    logger.log('iridium/manager', 'initializing webRTC')
    await this.webRTC.init()
    logger.log('iridium/manager', 'initializing settings')
    await this.settings.init()
    logger.log('iridium/manager', 'ready')

    this.ready = true
  }
}

const instance = new IridiumManager()
export default instance
