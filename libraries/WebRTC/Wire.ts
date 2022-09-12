import Peer from 'simple-peer'
import { IridiumDocument, IridiumMessage } from '@satellite-im/iridium'
import Emitter from './Emitter'
import iridium from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'

export type PeerDescriptor = {
  id: string
  name: string
}

export class WirePeer extends Peer {
  id: string
  name: string

  constructor({ id, name }: PeerDescriptor, opts?: Peer.Options) {
    super(opts)
    this.id = id
    this.name = name
  }
}

type WebRTCAnnounceMessage = {
  type: 'announce'
  status?: 'online' | 'offline'
}

type DefaultBusOptions = {}
type BusOptions<T> = DefaultBusOptions & T

interface BusListeners<T> {
  message: (data: { type: string; message: T }) => void
  signal: (data: {
    type: string
    from: string
    signalData: Peer.SignalData
  }) => void
}

export interface Bus<T, O> extends Emitter<BusListeners<T>> {
  type: string
  onMessage: (message: T) => void
  sendMessage: (message: T, opts: BusOptions<O>) => void
  destroy: () => void
}

export class IridiumBus
  extends Emitter<BusListeners<IridiumMessage<IridiumDocument>>>
  implements Bus<IridiumMessage<IridiumDocument>, { recipients: string[] }>
{
  private _channel: string
  type: string = 'iridium_pubsub'

  constructor(channel: string) {
    super()

    this._channel = channel

    iridium.connector?.subscribe(this._channel, {
      handler: this.onMessage.bind(this),
      sync: true,
    })
  }

  onMessage(message: IridiumMessage<IridiumDocument>) {
    if (message.payload.body.type === 'signal') {
      return this.emit('signal', {
        type: this.type,
        from: message.from.toString(),
        signalData: message.payload.body.data,
      })
    }

    this.emit('message', { type: this.type, message })
  }

  sendMessage(
    message: IridiumDocument,
    opts: BusOptions<{ recipients: string[] }>,
  ) {
    return Promise.all(
      opts.recipients.map((did) =>
        iridium.connector?.publish(this._channel, message, {
          encrypt: { recipients: [did] },
        }),
      ),
    )
  }

  destroy() {
    iridium.connector?.off(this._channel, this.onMessage.bind(this))
  }
}

type WireEventListeners = {
  'bus:message': (data: {
    type: string
    message: IridiumMessage<IridiumDocument>
  }) => void
}

class DirectWebrtc
  extends Emitter<BusListeners<IridiumMessage<IridiumDocument>>>
  implements Bus<IridiumMessage<IridiumDocument>, { recipients: string[] }>
{
  type: string
  private peers: {
    [did: string]: {
      peer: Peer.Instance
      initiator: boolean
      isConnecting: boolean
    }
  } = {}

  constructor() {
    super()
    this.type = 'direct_webrtc'
  }

  onMessage(message: IridiumMessage<IridiumDocument>) {
    this.emit('message', { type: this.type, message })
  }

  sendMessage(
    message: IridiumDocument,
    opts: BusOptions<{ recipients: string[] }>,
  ) {}

  createPeer(id: string, opts?: Peer.Options) {
    if (this.peers[id]) throw new Error('Peer already exists')

    const peer = new Peer(opts)

    this.peers[id] = {
      peer,
      initiator: Boolean(opts?.initiator),
      isConnecting: true,
    }

    this.bindPeerListeners(id)
  }

  private bindPeerListeners(id: string) {
    const peer = this.peers[id].peer
    if (!peer) return

    peer.on('signal', this.onSignal.bind(this, id))
  }

  private unbindPeerListeners(id: string) {
    const peer = this.peers[id].peer
    if (!peer) return

    peer.off('signal', this.onSignal.bind(this, id))
  }

  onSignal(id: string, data: Peer.SignalData) {
    this.emit('signal', { type: this.type, signalData: data, from: id })
  }

  isConnected(id: string) {
    return Boolean(this.peers[id]?.peer?.connected)
  }

  isConnecting(id: string) {
    return Boolean(this.peers[id]?.isConnecting)
  }

  destroy() {
    Object.keys(this.peers).forEach((did) => this.unbindPeerListeners(did))

    this.peers = {}
  }
}

// export class Wire extends Emitter<WireEventListeners> {
//   private loggerTag: string = 'Wire'
//   private announceFrequency = 5000
//   private _busses: {
//     iridium_pubsub?: IridiumBus
//     direct_webrtc?: DirectWebrtc
//   } = {}

//   async init() {
//     this._busses = {
//       iridium_pubsub: new IridiumBus('/webrtc/announce'),
//       direct_webrtc: new DirectWebrtc(),
//     }

//     this._busses.iridium_pubsub!.on('message', this.onMessage.bind(this))
//     this._busses.direct_webrtc!.on('signal', this.onSignal.bind(this))
//     this._busses.iridium_pubsub!.on('signal', this.onSignal.bind(this))
//   }

//   onMessage({
//     type,
//     message,
//   }: {
//     type: string
//     message: IridiumMessage<IridiumDocument>
//   }) {
//     if (message.from === iridium.id) {
//       logger.debug(this.loggerTag, "it's you")
//     }
//     logger.debug(this.loggerTag, type, message)
//     this.emit('bus:message', { type, message })

//     const friend = iridium.friends.state.friends.find(
//       (did) => did === message.from,
//     )

//     if (!friend) {
//       logger.debug(this.loggerTag, `Friend not found: ${friend}`)
//       return
//     }

//     this.onFriendAnnounce(message.from.toString())
//   }

//   onSignal({
//     type,
//     from,
//     signalData,
//   }: {
//     type: string
//     from: string
//     signalData: Peer.SignalData
//   }) {
//     logger.debug(this.loggerTag, 'SIGNAL DATA FROM', {
//       type,
//       from,
//       data: JSON.stringify(signalData),
//     })
//   }

//   onFriendAnnounce(did: string) {
//     logger.debug(this.loggerTag, `Announce from friend ${did}`)

//     if (this._busses.direct_webrtc?.isConnected(did)) {
//       logger.debug(this.loggerTag, `Friend already connected: ${did}`)
//       return
//     }

//     if (this._busses.direct_webrtc?.isConnecting(did)) {
//       logger.debug(this.loggerTag, `Already trying to connect with: ${did}`)
//       return
//     }

//     this._busses.direct_webrtc?.createPeer(did, { initiator: true })
//   }

//   sendMessage(
//     busType: keyof Wire['_busses'],
//     message: IridiumDocument,
//     opts: BusOptions<{ recipients: string[] }>,
//   ) {
//     const bus = this._busses[busType]

//     if (!bus) {
//       throw new Error('Selected bus type does not exist')
//     }

//     bus.sendMessage(message, opts)
//   }

//   async announce(busType: keyof Wire['_busses'] = 'iridium_pubsub') {
//     if (!iridium.connector) return
//     const profile = iridium.profile.state
//     const friends = iridium.friends.state.friends
//     if (!profile || !friends) return

//     logger.debug(this.loggerTag, 'announce', {
//       friends,
//     })

//     if (!friends || !friends.length || !profile.name) return

//     const recipients = friends.filter(
//       (friend) =>
//         !this._busses.direct_webrtc?.isConnected(friend) &&
//         !this._busses.direct_webrtc?.isConnecting(friend),
//     )

//     try {
//       this._busses[busType]?.sendMessage(
//         {
//           type: 'announce',
//         },
//         {
//           recipients,
//         },
//       )
//     } catch (e) {
//       const error = e as Error
//       logger.error(this.loggerTag, 'announce failed to publish', error)
//     }
//   }

//   async setupAnnounce() {
//     await new Promise((resolve) =>
//       setTimeout(
//         () => this.announce('iridium_pubsub').then(() => resolve(true)),
//         5000,
//       ),
//     )
//     setInterval(this.announce.bind(this), this.announceFrequency)
//   }
// }

export class Wire extends Emitter<WireEventListeners> {
  private loggerTag: string = 'Wire'
  private announceFrequency = 5000
  private _bus?: IridiumBus
  private peers: {
    [did: string]: {
      peer: Peer.Instance
      initiator: boolean
      isConnecting: boolean
    }
  } = {}

  async init() {
    this._bus = new IridiumBus('/webrtc/announce')

    this._bus.on('message', this.onMessage.bind(this))
    this._bus.on('signal', this.onBusSignal.bind(this))
  }

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
    this.emit('bus:message', { type, message })

    const friend = iridium.friends.state.friends.find(
      (did) => did === message.from,
    )

    if (!friend) {
      logger.debug(this.loggerTag, `Friend not found: ${friend}`)
      return
    }

    this.onFriendAnnounce(message.from.toString())
  }

  onFriendAnnounce(did: string) {
    logger.debug(this.loggerTag, `Announce from friend ${did}`)

    if (this.peers[did]?.peer?.connected) {
      logger.debug(this.loggerTag, `Friend already connected: ${did}`)
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

    const peer = new Peer(opts)

    this.peers[id] = {
      peer,
      initiator: Boolean(opts?.initiator),
      isConnecting: true,
    }

    this.bindPeerListeners(id)

    logger.debug(this.loggerTag, 'Peer created for', { did: id })

    return peer
  }

  private bindPeerListeners(id: string) {
    const peer = this.peers[id].peer
    if (!peer) return

    peer.on('signal', this.onPeerSignal.bind(this, id))
    peer.on('connect', this.onPeerConnect.bind(this, id))
    peer.on('close', this.onPeerClose.bind(this, id))
    peer.on('error', this.onPeerError.bind(this, id))
  }

  private unbindPeerListeners(id: string) {
    const peer = this.peers[id].peer
    if (!peer) return

    peer.off('signal', this.onPeerSignal.bind(this, id))
    peer.off('connect', this.onPeerConnect.bind(this, id))
    peer.off('close', this.onPeerClose.bind(this, id))
    peer.off('error', this.onPeerError.bind(this, id))
  }

  onPeerSignal(id: string, data: Peer.SignalData) {
    const peer = this.peers[id].peer
    if (!peer) return

    this._bus?.sendMessage({ type: 'signal', data }, { recipients: [id] })
    logger.debug(this.loggerTag, 'SIGNAL SENT', {
      data,
      id,
      timestamp: Date.now(),
    })
  }

  onPeerConnect(id: string) {
    logger.debug(this.loggerTag, 'Peer connected', { id })
    const peerDescriptor = this.peers[id]

    if (peerDescriptor) {
      peerDescriptor.isConnecting = false
    }
  }

  onPeerClose(id: string) {
    logger.debug(this.loggerTag, 'Peer disconnected', { id })

    this.destroyPeer(id)
  }

  onPeerError(id: string, error: Error) {
    logger.debug(this.loggerTag, 'Peer error', { id, error })

    this.destroyPeer(id)
  }

  destroyPeer(id: string) {
    this.unbindPeerListeners(id)
    const { peer } = this.peers[id]

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
    logger.debug(this.loggerTag, 'SIGNAL DATA FROM', {
      type,
      from,
      data: JSON.stringify(signalData),
      timestamp: Date.now(),
    })

    const peerDescriptor = this.peers[from]

    const isOffer = signalData.type === 'offer'

    if (peerDescriptor?.initiator && isOffer && from > iridium.id) {
      logger.debug(
        this.loggerTag,
        'Received signal from a peer we are already trying to connect with, but we have to become slave',
      )

      this.destroyPeer(from)
    }

    if (!this.peers[from]) {
      this.createPeer(from, { initiator: false })
    }

    logger.debug(this.loggerTag, 'SENDING SIGNAL TO LOCAL PEER', {
      from,
      peerExist: Boolean(this.peers[from]?.peer),
      isInitiator: this.peers[from]?.initiator,
      isOffer,
      shouldBeSlave: from > iridium.id,
    })

    this.peers[from]?.peer?.signal(signalData)
  }

  sendMessage(
    message: IridiumDocument,
    opts: BusOptions<{ recipients: string[] }>,
  ) {
    this._bus?.sendMessage(message, opts)
  }

  async announce() {
    if (!iridium.connector) return
    const profile = iridium.profile.state
    const friends = iridium.friends.state.friends
    if (!profile || !friends) return

    if (!friends || !friends.length || !profile.name) return

    const recipients = friends.filter(
      (friend) =>
        !this.peers[friend]?.peer?.connected &&
        !this.peers[friend]?.isConnecting,
    )

    logger.debug(this.loggerTag, 'announce', {
      recipients,
    })

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
    await new Promise((resolve) =>
      setTimeout(() => this.announce().then(() => resolve(true)), 5000),
    )
    setInterval(this.announce.bind(this), this.announceFrequency)
  }
}
