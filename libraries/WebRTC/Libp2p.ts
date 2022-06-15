import { Connection, MuxedStream, create } from 'libp2p'
// @ts-ignore
import Mplex from 'libp2p-mplex'
// @ts-ignore
import secio from 'libp2p-secio'
import { NOISE } from 'libp2p-noise'
// @ts-ignore
import WStar from 'libp2p-webrtc-star'
import { SignalData } from 'simple-peer'
import LibP2PCrypto, { keys } from 'libp2p-crypto'
import type Libp2p from 'libp2p/dist/src/index'
import PeerId, {
  createFromB58String,
  createFromPrivKey,
  createFromPubKey,
} from 'peer-id'
import { pipe } from 'it-pipe'
import { Keypair } from '@solana/web3.js'
import Emitter from './Emitter'
import { WireMessage } from './types'
import type { CallPeerDescriptor } from './Call'
import logger from '~/plugins/local/logger'
import { ConversationParticipant } from '~/store/conversation/types'

enum P2PProtocols {
  COMMUNICATION_BUS = '/sattest/chat/1.0.0',
}

interface P2PListeners {
  'peer:discovery': (data: { peerId: PeerId }) => void
  'peer:connect': (data: { peerId: PeerId }) => void
  'peer:disconnect': (data: { peerId: PeerId }) => void
  'peer:onmessage': (data: { peerId: PeerId; message: WireMessage }) => void
  'peer:signal': (data: { peerId: PeerId; payload: SignalData }) => void
  'peer:refuse': (data: { peerId: PeerId; payload: unknown }) => void
  'peer:data': (data: { peerId: PeerId; payload: unknown }) => void
  'peer:typing': (data: { peerId: PeerId; payload: unknown }) => void
  'peer:announce': (data: {
    peerId: PeerId
    payload: ConversationParticipant
  }) => void
  'peer:destroy': (data: { peerId: PeerId; payload: unknown }) => void
  'peer:hangup': (data: { peerId: PeerId; payload: unknown }) => void
  'peer:screenshare': (data: {
    peerId: PeerId
    payload: { streamId: string }
  }) => void
  'peer:mute': (data: {
    peerId: PeerId
    payload: {
      callId: string
      streamId: string
      trackId: string
      kind: string
    }
  }) => void
  'peer:unmute': (data: {
    peerId: PeerId
    payload: {
      callId: string
      streamId: string
      trackId: string
      kind: string
    }
  }) => void
  'peer:call': (data: {
    peerId: PeerId
    payload: {
      callId: string
      peers?: CallPeerDescriptor[]
      signal?: SignalData
    }
  }) => void
}

type P2PMessage = {
  type: string
  payload: unknown
  sentAt: number
}

type SupportedKeyType = keyof typeof LibP2PCrypto.keys.supportedKeys

export interface PrivateKeyInfo {
  privateKey: Uint8Array
  type: SupportedKeyType
}

export interface PublicKeyInfo {
  publicKey: Uint8Array
  type: SupportedKeyType
}

interface InitializationOptions {
  publickey: PublicKeyInfo
}

export class Peer2Peer extends Emitter<P2PListeners> {
  private _node?: Libp2p
  private _peerId?: PeerId
  static instance: Peer2Peer // eslint-disable-line no-use-before-define

  public static getInstance(): Peer2Peer {
    if (!Peer2Peer.instance) {
      Peer2Peer.instance = new Peer2Peer()
    }
    return Peer2Peer.instance
  }

  get peerId() {
    return this._peerId
  }

  get id() {
    return this._peerId?.toB58String()
  }

  async init(opts?: InitializationOptions) {
    if (opts) {
      this._peerId = await this._getPeerIdByType(opts.publickey)
    }

    this._node = await create({
      modules: {
        transport: [WStar],
        streamMuxer: [Mplex],
        connEncryption: [NOISE, secio],
      },
      addresses: {
        listen: [
          '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
          '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        ],
      },
      config: {
        peerDiscovery: {
          mdns: {
            enabled: true,
          },
          webRTCStar: {
            enabled: true,
          },
        },
        pubsub: {
          enabled: true,
          canRelayMessage: true,
        },
      },
      peerId: this.peerId,
      connectionManager: {
        autoDial: false, // Auto connect to discovered peers (limited by ConnectionManager minConnections)
        // The `tag` property will be searched when creating the instance of your Peer Discovery service.
        // The associated object, will be passed to the service when it is instantiated.
      },
    })

    this._bindListeners()
    this._bindProtocols()
  }

  private async _getPeerIdByType(publicKeyInfo: PublicKeyInfo) {
    switch (publicKeyInfo.type) {
      case 'ed25519': {
        window.console.log('publicKeyInfo', publicKeyInfo)
        const publicKey =
          await keys.supportedKeys.ed25519.unmarshalEd25519PublicKey(
            publicKeyInfo.publicKey,
          )

        return createFromPubKey(publicKey.bytes)
      }

      default: {
        break
      }
    }
  }

  start() {
    if (!this._node) return

    this._node.start()
  }

  stop() {
    if (!this._node) return

    this._node.stop()
  }

  async connect(peerId: PeerId) {
    return this._dial(peerId)
  }

  get node() {
    return this._node
  }

  private _bindListeners() {
    if (!this._node) return

    this._node.on('peer:discovery', this._onPeerDiscovery.bind(this))
    this._node.connectionManager.on(
      'peer:connect',
      this._onPeerConnect.bind(this),
    )
    this._node.connectionManager.on(
      'peer:disconnect',
      this._onPeerDisconnect.bind(this),
    )
  }

  private _bindProtocols() {
    if (!this._node) return

    this._node.handle(
      P2PProtocols.COMMUNICATION_BUS,
      this._messageHandler.bind(this),
    )
  }

  private _onPeerDiscovery(peerId: PeerId) {
    this.emit('peer:discovery', { peerId })
  }

  private async _onPeerConnect(connection: Connection) {
    this.emit('peer:connect', { peerId: connection.remotePeer })
  }

  private _onPeerDisconnect(connection: Connection) {
    this.emit('peer:disconnect', { peerId: connection.remotePeer })
  }

  private async _messageHandler({
    connection,
    stream,
  }: {
    connection: Connection
    stream: MuxedStream
  }) {
    try {
      await pipe(stream, async (source) => {
        for await (const msg of source) {
          const peerId = connection.remotePeer
          const message = JSON.parse(msg)

          if (
            [
              'peer:call',
              'peer:answer',
              'peer:destroy',
              'peer:announce',
              'peer:refuse',
              'peer:hangup',
              'peer:mute',
              'peer:unmute',
              'peer:screenshare',
            ].includes(message.type)
          ) {
            this.emit(message.type, { peerId, ...message })
            return
          }

          if (message.type === 'DATA') {
            this.emit('peer:data', {
              peerId,
              payload: message.payload,
            })
            return
          }

          if (message.type === 'REFUSE') {
            this.emit('peer:refuse', {
              peerId,
              payload: message.payload,
            })
            return
          }

          if (message.type === 'HANGUP') {
            this.emit('peer:hangup', {
              peerId,
              payload: message.payload,
            })
            return
          }

          if (message.type === 'TYPING_STATE') {
            this.emit('peer:typing', {
              peerId: connection.remotePeer,
              payload: message.payload,
            })
            return
          }

          if (message.type === 'SIGNAL') {
            this.emit('peer:signal', {
              peerId,
              payload: message.payload,
            })
            return
          }

          this.emit('peer:onmessage', {
            peerId,
            message,
          })
        }
      })
    } catch (error) {
      logger.log('libp2p', `Peer message error: ${error}`)
    }
  }

  private _dial(peerId: PeerId) {
    if (!this._node) return

    return this._node.dialProtocol(peerId, P2PProtocols.COMMUNICATION_BUS)
  }

  private async _sendMessage(message: string, stream: any) {
    return pipe([message], stream)
  }

  getPeer(peerId: PeerId) {
    if (!this._node) return
    return this._node.peerStore.get(peerId)
  }

  async sendMessage(message: P2PMessage, peerId: PeerId | string) {
    if (!peerId) {
      throw new Error('peerId is required')
    }
    const peer = peerId instanceof PeerId ? peerId : createFromB58String(peerId)
    if (!this._node) return

    const connection = this._node.connectionManager.get(peer)

    if (!connection) return

    const { stream } = await connection.newStream(
      P2PProtocols.COMMUNICATION_BUS,
    )

    return this._sendMessage(JSON.stringify(message), stream)
  }
}
