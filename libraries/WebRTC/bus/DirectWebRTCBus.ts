import { IridiumDocument, IridiumMessage } from '@satellite-im/iridium'
import Peer from 'simple-peer'
import type { SignalData, Instance } from 'simple-peer'
import { Bus, BusListeners, BusOptions } from '~/libraries/WebRTC/bus/bus'
import Emitter from '~/libraries/WebRTC/Emitter'

export class DirectWebrtc
  extends Emitter<BusListeners<IridiumMessage<IridiumDocument>>>
  implements Bus<IridiumMessage<IridiumDocument>, { recipients: string[] }>
{
  type: string
  private peers: {
    [did: string]: {
      peer: Instance
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

  onSignal(id: string, data: SignalData) {
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
