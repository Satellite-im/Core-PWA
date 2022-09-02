import { Emitter, createIridiumIPFS } from '@satellite-im/iridium'
import type { IridiumIPFS } from '@satellite-im/iridium'
import UsersManager from './users/UsersManager'
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
  webRTC: WebRTCManager
  settings: SettingsManager
  users: UsersManager

  constructor() {
    super()
    this.profile = new ProfileManager()
    this.groups = new GroupManager()
    this.friends = new FriendsManager()
    this.chat = new ChatManager()
    this.files = new FilesManager()
    this.webRTC = new WebRTCManager()
    this.settings = new SettingsManager()
    this.notifications = new NotificationManager()
    this.users = new UsersManager()
  }

  /**
   * @method
   * Initialization function that creates a Textile identity
   * and initializes the Mailbox
   * @param param0 Textile Configuration that includes id, password and SolanaWallet instance
   * @returns a promise that resolves when the initialization completes
   */
  async init({ pass, wallet }: { pass: string; wallet: Account }) {
    this.connector?.on('stopping', async () => {
      await this.users.stop?.()
    })

    logger.log('iridium/manager', 'init()')
    const seed = await IdentityManager.seedFromWallet(pass, wallet)
    return this.initFromEntropy(seed)
  }

  get id(): string {
    if (!this.connector) {
      throw new Error('Iridium not initialized')
    }
    return this.connector.id
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
        profile: {},
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

    if (this.connector.p2p.ready) {
      logger.debug('iridium/manager', 'p2p already ready')
      await this.onP2pReady()
    } else {
      logger.debug('iridium/manager', 'waiting for p2p readiness')
      this.connector.p2p.on('ready', this.onP2pReady.bind(this))
    }

    this.profile.on('ready', this.onProfileChange.bind(this))
    this.profile.on('changed', this.onProfileChange.bind(this))
  }

  async onProfileChange() {
    if (this.profile.state?.did) {
      logger.log('iridium/manager', 'sending sync init')
      await this.sendSyncInit()
    }
  }

  async onP2pReady() {
    logger.log('iridium/manager', 'initializing users')
    await this.users.init()
    logger.log('iridium/manager', 'initializing groups')
    await this.groups.init()
    logger.log('iridium/manager', 'initializing files')
    await this.files.init()
    logger.log('iridium/manager', 'initializing webRTC')
    await this.webRTC.init()
    logger.log('iridium/manager', 'initializing settings')
    await this.settings.init()
    logger.log('iridium/manager', 'notification settings')
    await this.notifications.init()
    logger.log('iridium/friends', 'initializing friends')
    await this.friends.init()
    logger.log('iridium/manager', 'initializing chat')
    await this.chat.init()
    logger.log('iridium/manager', 'ready')
    this.ready = true
    this.emit('ready', {})
  }

  async sendSyncInit() {
    const connector = this.connector
    if (!connector?.p2p.primaryNodeID) {
      logger.warn('iridium/manager', 'no primary node, cannot send sync init', {
        primaryNodeID: connector?.p2p.primaryNodeID,
        ready: connector?.p2p.ready,
      })
      return
    }
    const profile = this.profile.state
    logger.info('iridium/manager', 'sending sync init', { profile })
    const payload = {
      type: 'sync/init',
      at: Date.now(),
      name: profile?.name || this.id,
      avatar: profile?.photoHash || '',
    }

    await connector.p2p.send(connector.p2p.primaryNodeID, payload)
  }
}

const instance = new IridiumManager()
export default instance
