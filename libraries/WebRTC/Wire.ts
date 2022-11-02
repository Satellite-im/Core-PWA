import Peer from 'simple-peer'
import {
  IridiumDocument,
  IridiumMessage,
  encoding,
  IridiumPayload,
} from '@satellite-im/iridium'
import * as json from 'multiformats/codecs/json'
import Emitter from './Emitter'
import iridium from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'
import { BusOptions } from '~/libraries/WebRTC/bus/bus'
import { IridiumBus } from '~/libraries/WebRTC/bus/IridiumBus'
import { delay } from '~/libraries/Iridium/utils'
import { Config } from '~/config'
import { truthy } from '~~/utilities/typeGuard'

type WireEventListeners = {
  'wire:message': (data: {
    type: string
    message: IridiumMessage<IridiumDocument>
  }) => void
  'peer:connect': (data: { did: string }) => void
  'peer:disconnect': (data: { did: string }) => void
}

export class Wire extends Emitter<WireEventListeners> {
  private loggerTag: string = 'Wire'
  private announceFrequency = 30000
  private firstAnnounceDelay = 5000
  private timeout = 60000
  private _bus?: IridiumBus
  private peers: {
    [did: string]: {
      peer: Peer.Instance
      initiator: boolean
      isConnecting: boolean
    }
  } = {}

  private timers: {
    [did: string]: ReturnType<typeof setTimeout>
  } = {}

  async start() {
    this._bus = new IridiumBus('/webrtc/announce')

    this._bus.on('message', this.onMessage.bind(this))
    this._bus.on('signal', this.onBusSignal.bind(this))

    await this.setupAnnounce()
  }

  async stop() {}

  onMessage({
    type,
    message,
  }: {
    type: string
    message: IridiumMessage<IridiumDocument>
  }) {
    if (message.from === iridium.id) {
      logger.debug(this.loggerTag, "it's you")
      return
    }
    logger.debug(this.loggerTag, type, message)
    this.emit('wire:message', { type, message })

    const user = iridium.users.getUser(message.from)
    if (!user) {
      logger.warn(this.loggerTag, `User not found: ${message.from}`)
      return
    }

    if (
      !iridium.friends.isFriend(user.did) &&
      !iridium.chat.isUserInOtherGroups(user.did, [], false)
    ) {
      logger.error(
        this.loggerTag,
        `User not a friend and not in any group: ${message.from}`,
      )
      return
    }

    this.onUserAnnounce(message.from.toString())
  }

  onUserAnnounce(did: string) {
    logger.debug(this.loggerTag, `Announce from user ${did}`)

    if (this.peers[did]?.peer?.connected) {
      logger.debug(this.loggerTag, `User already connected: ${did}`)
      return
    }

    if (this.peers[did]?.isConnecting) {
      logger.debug(this.loggerTag, `Already trying to connect with: ${did}`)
      return
    }

    this.createPeer(did, { initiator: true })
  }

  createPeer(id: string, opts?: Peer.Options) {
    if (this.peers[id]) throw new Error('Peer already exists')

    const peer = new Peer({
      ...opts,
      config: {
        iceServers: Config.webrtc.iceServers,
      },
    })

    this.peers[id] = {
      peer,
      initiator: Boolean(opts?.initiator),
      isConnecting: true,
    }

    this.startTimeout(id)

    this.bindPeerListeners(id)

    logger.debug(this.loggerTag, 'Peer created for', { did: id })

    return peer
  }

  private onTimeout(id: string) {
    logger.debug(this.loggerTag, 'Connection attempt timed out', { id })
    this.destroyPeer(id)
  }

  private bindPeerListeners(id: string) {
    const peer = this.peers[id].peer
    if (!peer) return

    peer.on('signal', this.onPeerSignal.bind(this, id))
    peer.on('connect', this.onPeerConnect.bind(this, id))
    peer.on('close', this.onPeerClose.bind(this, id))
    peer.on('error', this.onPeerError.bind(this, id))
    peer.on('data', this.onPeerData.bind(this, id))
  }

  private unbindPeerListeners(id: string) {
    const peer = this.peers[id]?.peer
    if (!peer) return

    peer.off('signal', this.onPeerSignal.bind(this, id))
    peer.off('connect', this.onPeerConnect.bind(this, id))
    peer.off('close', this.onPeerClose.bind(this, id))
    peer.off('error', this.onPeerError.bind(this, id))
    peer.off('data', this.onPeerData.bind(this, id))
  }

  async onPeerSignal(id: string, data: Peer.SignalData) {
    const peer = this.peers[id].peer
    if (!peer) return

    if (peer.connected && iridium.connector?.did) {
      const encodedMessage = await encoding.encodePayload(
        { type: 'signal', data },
        iridium.connector.did,
        { sign: true },
      )

      peer.send(encodedMessage)
    } else {
      this._bus?.sendMessage({ type: 'signal', data }, { recipients: [id] })
    }

    logger.debug(this.loggerTag, 'SIGNAL SENT', {
      data,
      id,
      timestamp: Date.now(),
    })
  }

  onPeerConnect(id: string) {
    logger.debug(this.loggerTag, 'Peer connected', { id })
    const peerDescriptor = this.peers[id]

    this.stopTimeout(id)

    if (peerDescriptor) {
      peerDescriptor.isConnecting = false
    }

    this.emit('peer:connect', { did: id })
  }

  private startTimeout(id: string) {
    this.stopTimeout(id)
    this.timers[id] = setTimeout(this.onTimeout.bind(this, id), this.timeout)
  }

  private stopTimeout(id: string) {
    const timer = this.timers[id]
    if (timer) {
      clearTimeout(timer)
      delete this.timers[id]
    }
  }

  onPeerClose(id: string) {
    logger.debug(this.loggerTag, 'Peer disconnected', { id })
    this.emit('peer:disconnect', { did: id })

    this.destroyPeer(id)
  }

  onPeerError(id: string, error: Error) {
    logger.debug(this.loggerTag, 'Peer error', { id, error })
    this.emit('peer:disconnect', { did: id })

    this.destroyPeer(id)
  }

  onPeerData(id: string, data: Uint8Array) {
    logger.debug(this.loggerTag, 'Peer data', { id, data })

    if (!iridium.connector) return

    const payload = json.decode<IridiumPayload>(data)
    if (!payload) return

    encoding
      .decodePayload(payload, iridium.connector.did)
      .then((decoded) => {
        logger.debug(this.loggerTag, 'Decoded payload', { decoded })
        this.emit('wire:message', {
          type: 'direct_webrtc',
          message: { from: id, payload: decoded },
        })
      })
      .catch((err: Error) =>
        logger.error(this.loggerTag, 'Decoding error', { err }),
      )
  }

  destroyPeer(id: string) {
    const peer = this.peers[id]?.peer
    if (!peer) return

    this.unbindPeerListeners(id)

    peer.destroy()

    delete this.peers[id]

    logger.debug(this.loggerTag, 'DESTROYED PEER', { id })
  }

  onBusSignal({
    type,
    from,
    signalData,
  }: {
    type: string
    from: string
    signalData: Peer.SignalData
  }) {
    logger.debug(this.loggerTag, 'Signal data receive from', {
      type,
      from,
      data: JSON.stringify(signalData),
      timestamp: Date.now(),
    })

    const peerDescriptor = this.peers[from]

    const isOffer = signalData.type === 'offer'

    // In case we receive an offer, but we were already trying to connect
    // we check the alphabetical order of the DIDs to determine which one of
    // the peers must try to reconnect without the initiator flag
    if (peerDescriptor?.initiator && isOffer && from > iridium.id) {
      logger.debug(
        this.loggerTag,
        'Received signal from a peer we are already trying to connect with, but we have to reconnect without the initiator flag',
      )

      this.destroyPeer(from)
    }

    if (!this.peers[from]) {
      this.createPeer(from, { initiator: false })
    }

    logger.debug(this.loggerTag, 'Sending signal to local peer', {
      from,
      peerExist: Boolean(this.peers[from]?.peer),
      isInitiator: this.peers[from]?.initiator,
      isOffer,
      shouldBeSlave: from > iridium.id,
    })

    this.peers[from]?.peer?.signal(signalData)
  }

  async sendMessage(
    message: IridiumDocument,
    opts: BusOptions<{ recipients: string[] }>,
  ) {
    const online: string[] = []
    const offline: string[] = []

    opts.recipients.forEach((recipient) => {
      if (this.isConnected(recipient)) {
        online.push(recipient)
      } else {
        offline.push(recipient)
      }
    })

    logger.debug(this.loggerTag, 'Sending message to', {
      online,
      offline,
      message,
    })

    if (online.length && iridium.connector) {
      const encodedMessage = await encoding.encodePayload(
        message,
        iridium.connector.did,
        { sign: true },
      )

      // Send the message through webrtc when possible
      online.forEach((recipient) => {
        this.peers[recipient]?.peer?.send(encodedMessage)
      })
    }

    // Fallback to pubsub for offline users
    // this._bus?.sendMessage(message, { recipients: offline })
  }

  async announce() {
    if (!iridium.connector) return
    const profile = iridium.profile.state
    const users = iridium.users.list.filter(
      (u) =>
        u &&
        (iridium.friends.isFriend(u.did) ||
          iridium.chat.isUserInOtherGroups(u.did, [], false)),
    )

    if (!profile || !users) return

    if (!users || !users.length || !profile.name) return

    const recipients = users
      .map((u) => u?.did)
      .filter(truthy)
      .filter(
        (did) =>
          !this.peers[did]?.peer?.connected && !this.peers[did]?.isConnecting,
      )

    if (recipients.length) {
      logger.debug(this.loggerTag, 'announce', {
        recipients,
      })
    }

    try {
      this._bus?.sendMessage(
        {
          type: 'announce',
        },
        {
          recipients,
        },
      )
    } catch (e) {
      const error = e as Error
      logger.error(this.loggerTag, 'announce failed to publish', error)
    }
  }

  async setupAnnounce() {
    await delay(this.firstAnnounceDelay)
    await this.announce()
    setInterval(this.announce.bind(this), this.announceFrequency)
  }

  isConnected(id: string) {
    return Boolean(this.peers[id]?.peer?.connected)
  }
}
