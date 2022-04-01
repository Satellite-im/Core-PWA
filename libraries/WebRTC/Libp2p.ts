import { Connection, MuxedStream, create } from 'libp2p'
// @ts-ignore
// import WS from 'libp2p-websockets'
// @ts-ignore
import Mplex from 'libp2p-mplex'
// @ts-ignore
import secio from 'libp2p-secio'
import { NOISE } from 'libp2p-noise'
// @ts-ignore
import WStar from 'libp2p-webrtc-star'
import LibP2PCrypto, { keys } from 'libp2p-crypto'
import type Libp2p from 'libp2p/dist/src/index'
import PeerId, { createFromPrivKey } from 'peer-id'
import { pipe } from 'it-pipe'
import { isRight } from 'fp-ts/lib/Either'
import Emitter from './Emitter'
import { WireMessage } from './types'
import {
  wireDataMessage,
  wireKeyboardState,
  wireRefuseConnectionMessage,
} from './encoders'

enum P2PProtocols {
  COMMUNICATION_BUS = '/satellite/chat/1.0.0',
}

interface P2PListeners {
  'peer:discovery': (data: { peerId: PeerId }) => void
  'peer:connect': (data: { peerId: PeerId }) => void
  'peer:disconnect': (data: { peerId: PeerId }) => void
  'peer:onmessage': (data: { peerId: PeerId; message: WireMessage }) => void
  'peer:typing': (data: { peerId: PeerId }) => void
}

type SupportedKeyType = keyof typeof LibP2PCrypto.keys.supportedKeys

export interface PrivateKeyInfo {
  privateKey: Uint8Array
  type: SupportedKeyType
}

interface InitializationOptions {
  privateKey: PrivateKeyInfo
}

export class Peer2Peer extends Emitter<P2PListeners> {
  static instance: Peer2Peer // eslint-disable-line no-use-before-define
  private node?: Libp2p

  public static getInstance(): Peer2Peer {
    if (!Peer2Peer.instance) {
      Peer2Peer.instance = new Peer2Peer()
    }
    return Peer2Peer.instance
  }

  async init(opts?: InitializationOptions) {
    let peerid: PeerId | undefined
    if (opts) {
      peerid = await this._getPeerIdByType(opts.privateKey)
    }

    console.log('My peer id', peerid?.toB58String())

    this.node = await create({
      modules: {
        transport: [WStar],
        streamMuxer: [Mplex],
        connEncryption: [NOISE, secio],
      },
      addresses: {
        listen: [
          '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
          // '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        ],
      },
      peerId: peerid,
      connectionManager: {
        autoDial: false, // Auto connect to discovered peers (limited by ConnectionManager minConnections)
        // The `tag` property will be searched when creating the instance of your Peer Discovery service.
        // The associated object, will be passed to the service when it is instantiated.
      },
    })

    this._bindListeners()
    this._bindProtocols()
  }

  private async _getPeerIdByType(privateKeyInfo: PrivateKeyInfo) {
    switch (privateKeyInfo.type) {
      case 'ed25519': {
        const privateKey =
          await keys.supportedKeys.ed25519.unmarshalEd25519PrivateKey(
            privateKeyInfo.privateKey,
          )

        return createFromPrivKey(privateKey.bytes)
      }

      default: {
        console.log('rsa')
        break
      }
    }
  }

  start() {
    if (!this.node) return

    this.node.start()
  }

  stop() {
    if (!this.node) return

    this.node.stop()
  }

  async connect(peerId: PeerId) {
    console.log('trying to connect with', peerId.toB58String())
    return this._dial(peerId)
  }

  private _bindListeners() {
    if (!this.node) return

    this.node.on('peer:discovery', this._onPeerDiscovery.bind(this))
    this.node.connectionManager.on(
      'peer:connect',
      this._onPeerConnect.bind(this),
    )
    this.node.connectionManager.on(
      'peer:disconnect',
      this._onPeerDisconnect.bind(this),
    )
  }

  private _bindProtocols() {
    if (!this.node) return

    this.node.handle(
      P2PProtocols.COMMUNICATION_BUS,
      this._messageHandler.bind(this),
    )
  }

  private _onPeerDiscovery(peerId: PeerId) {
    // console.log('discovery', peerId.toB58String())
    this.emit('peer:discovery', { peerId })
  }

  private async _onPeerConnect(connection: Connection) {
    console.log('Connected to', connection.remotePeer.toB58String())

    this.emit('peer:connect', { peerId: connection.remotePeer })
  }

  private _onPeerDisconnect(connection: Connection) {
    console.log('Disconnected from', connection.remotePeer.toB58String())
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
        for await (const message of source) {
          console.log(`${connection.remotePeer.toB58String()}: ${message}`)

          const parsedData = JSON.parse(message)

          const dataMessage = wireDataMessage.decode(parsedData)

          if (isRight(dataMessage)) {
            const data = dataMessage.right.payload

            console.log('data message received', data)
            // this.emit('DATA', {
            //   peerId: this.identifier,
            //   data,
            // })

            return
          }

          const refuseMessage = wireRefuseConnectionMessage.decode(parsedData)

          if (isRight(refuseMessage)) {
            const data = refuseMessage.right.payload

            console.log('refuse message received', data)

            // this.emit('REFUSE', {
            //   peerId: this.identifier,
            // })

            return
          }

          const keyboardState = wireKeyboardState.decode(parsedData)

          if (isRight(keyboardState)) {
            this.emit('peer:typing', {
              peerId: connection.remotePeer,
            })

            console.log('typing state message received')

            return
          }

          console.log('row data message received')
          // this.emit('RAW_DATA', {
          //   peerId: this.identifier,
          //   data: parsedData.payload,
          // })
        }
      })

      // await pipe([])
    } catch (error) {
      console.log(error)
    }
  }

  private _dial(peerId: PeerId) {
    if (!this.node) return

    return this.node.dialProtocol(peerId, P2PProtocols.COMMUNICATION_BUS)
  }

  private async _sendMessage(message: string, stream: any) {
    return pipe([message], stream, async function (source) {
      for await (const message of source) {
        console.log('Sent this message:', message)
      }
    })
  }

  async sendMessage(message: WireMessage, peerId: PeerId) {
    console.log('send message to:', message, peerId.toB58String())
    if (!this.node) return

    const connection = this.node.connectionManager.get(peerId)

    if (!connection) return

    const { stream } = await connection.newStream(
      P2PProtocols.COMMUNICATION_BUS,
    )

    return this._sendMessage(JSON.stringify(message), stream)
  }
}
