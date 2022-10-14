import { Emitter, createIridiumIPFS, IridiumPeer } from '@satellite-im/iridium'
import type { IridiumIPFS } from '@satellite-im/iridium'
import UsersManager from './users/UsersManager'
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
  chat: ChatManager
  friends: FriendsManager
  files: FilesManager
  notifications: NotificationManager
  webRTC: WebRTCManager
  settings: SettingsManager
  users: UsersManager
  initDebounce?: NodeJS.Timeout
  syncTimeout?: NodeJS.Timeout

  constructor() {
    super()
    this.profile = new ProfileManager()
    this.friends = new FriendsManager()
    this.chat = new ChatManager()
    this.files = new FilesManager()
    this.webRTC = new WebRTCManager()
    this.settings = new SettingsManager()
    this.notifications = new NotificationManager()
    this.users = new UsersManager()
  }

  async start() {
    this.connector?.on('stopping', async () => {
      logger.info('iridium/manager', 'stopping')
      await this.stop()
    })
    logger.info('iridium/manager', 'init()')
  }

  async stop() {
    await Promise.all([
      this.friends.stop?.(),
      this.users.stop?.(),
      this.profile.stop?.(),
      this.chat.stop?.(),
      this.files.stop?.(),
      this.webRTC.stop?.(),
      this.settings.stop?.(),
      this.notifications.stop?.(),
    ])
  }

  get id(): string {
    if (!this.connector) {
      throw new Error('Iridium not initialized')
    }
    return this.connector.id
  }

  get shortId(): string {
    return this.profile.state
      ? `${this.profile.state.name}#${this.id.substring(this.id.length - 6)}`
      : this.id
  }

  async initFromEntropy(entropy: Uint8Array) {
    logger.info('iridium/manager', 'initFromEntropy()')
    this.connector = await createIridiumIPFS(entropy, {
      ...Config.iridium,
      logger,
    })

    logger.info('iridium/manager', 'connector initialized', {
      id: this.connector.id,
    })

    logger.info('iridium/manager', 'starting IPFS')
    await this.connector.start()

    // check for existing root document
    let doc = (await this.connector.get('/')) || {}
    if (!doc.id) {
      logger.info('iridium/manager', 'creating new root document', doc)
      doc = {
        id: this.connector.id,
        profile: {},
        friends: {},
        conversations: {},
        files: {},
        notifications: {},
        settings: {},
        indexes: {},
      }
    } else {
      logger.info('iridium/manager', 'loaded root document', doc)
    }
    doc.seen = Date.now()
    await this.connector.set('/', doc)
    this.connector.p2p.peerList
      .filter((peer) => peer.type === 'node' && peer.connected)
      .forEach((peer: IridiumPeer) => {
        this.sendSyncInit(peer.did)
      })
    this.connector.p2p.on('node/connect', async (node: IridiumPeer) => {
      await this.sendSyncInit(node.did)
    })
    this.connector.p2p.on('node/ready', async (node: IridiumPeer) => {
      await this.sendSyncInit(node.did)
    })
    this.connector.p2p.on('nodeReady', this.onP2pReady.bind(this))
    this.connector.p2p.on('ready', this.onP2pReady.bind(this))
    this.connector.on('ready', this.onP2pReady.bind(this))
    this.profile.on('ready', this.onP2pReady.bind(this))
    this.profile.on('changed', this.onP2pReady.bind(this))
    this.profile.on('ready', this.onProfileChange.bind(this))
    this.profile.on('changed', this.onProfileChange.bind(this))

    logger.info('iridium/manager', 'initializing profile')
    await this.profile.start()
  }

  async onProfileChange() {
    clearTimeout(this.initDebounce)
    this.initDebounce = setTimeout(async () => {
      logger.debug('iridium/manager', 'profile changed', {
        primaryNodeID: this.connector?.p2p.primaryNodeID,
        nodeReady: this.connector?.p2p.nodeReady,
      })
      this.connector?.p2p.peerList
        .filter((peer) => peer.type === 'node' && peer.connected)
        .forEach((peer: IridiumPeer) => {
          this.sendSyncInit(peer.did)
        })
    }, 1000)
  }

  async onP2pReady() {
    if (
      !this.profile.state?.did ||
      !this.connector?.p2p.primaryNodeID ||
      !this.connector?.p2p.hasNode ||
      !this.connector?.p2p.nodeReady ||
      !this.connector.p2p.ready
    ) {
      logger.debug(
        'iridium/manager',
        'p2p ready but no profile or primary node',
        {
          primaryNodeID: this.connector?.p2p.primaryNodeID,
          p2pReady: this.connector?.p2p.ready,
          nodeReady: this.connector?.p2p.nodeReady,
          hasNode: this.connector?.p2p.hasNode,
          did: this.profile.state?.did,
        },
      )
      return
    }
    if (this.ready) return

    logger.info('iridium/manager', 'initializing users')
    await this.users.start()

    logger.info('iridium/friends', 'initializing friends')
    this.friends.start()

    logger.info('iridium/manager', 'initializing chat')
    this.chat.start()

    logger.info('iridium/manager', 'ready')
    this.ready = true
    this.emit('ready', {})

    logger.info('iridium/manager', 'initializing files')
    this.files.start()

    logger.info('iridium/manager', 'initializing settings')
    this.settings.start()

    logger.info('iridium/manager', 'initializing webRTC')
    this.webRTC.start()

    logger.info('iridium/manager', 'notification settings')
    this.notifications.start()

    this.sendSyncFetch()
  }

  sendSyncFetch() {
    logger.info(
      'iridium/manager',
      'sending sync/fetch to retrieve offline messages from nodes',
    )

    this.connector?.p2p.peerList
      .filter((peer) => peer.connected && peer.type === 'node')
      .forEach((peer) => {
        this.connector?.p2p.send(peer.did, {
          type: 'sync/fetch',
          at: Date.now(),
        })
      })
  }

  async sendSyncInit(
    did: string | undefined = this.connector?.p2p.primaryNodeID,
  ) {
    if (!did && !this.connector?.p2p.primaryNodeID) {
      logger.error('iridium/manager', 'cannot send sync init without a did')
      return
    }
    const profile = this.profile.state
    if (!profile?.did) {
      return
    }
    logger.info('iridium/manager', 'sending sync init', { profile })
    const payload = {
      type: 'sync/init',
      at: Date.now(),
      name: profile?.name,
      avatar: profile?.photoHash,
      status: profile?.status,
    }

    return this.connector?.send(
      (did || this.connector.p2p.primaryNodeID) as string,
      payload,
    )
  }
}

const instance = new IridiumManager()

declare global {
  interface Window {
    iridium?: IridiumManager
  }
}

if (process.env.NUXT_ENV_IRIDIUM_DEBUG === 'true') {
  window.iridium = instance
}
export default instance
