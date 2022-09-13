import { IridiumDocument, IridiumMessage } from '@satellite-im/iridium'
import Peer from 'simple-peer'
import type { Instance } from 'simple-peer'
import { Bus, BusListeners, BusOptions } from '~/libraries/WebRTC/bus/bus'
import Emitter from '~/libraries/WebRTC/Emitter'

export class DirectWebrtc
  extends Emitter<BusListeners<IridiumMessage<IridiumDocument>>>
  implements Bus<IridiumMessage<IridiumDocument>, { recipients: string[] }>
{
  type: string
  private peer: Instance
  id: string

  constructor(id: string, peer: Instance) {
    super()
    this.type = 'direct_webrtc'
    this.peer = peer
    this.id = id

    this.bindPeerListeners()
  }

  onMessage(message: IridiumMessage<IridiumDocument>) {
    this.emit('message', { type: this.type, message })
  }

  sendMessage(
    message: IridiumDocument,
    opts: BusOptions<{ recipients: string[] }>,
  ) {
    this.peer.send(JSON.stringify(message))
  }

  private bindPeerListeners() {
    this.peer.on('data', this.onData.bind(this))
  }

  private unbindPeerListeners() {
    this.peer.off('data', this.onData.bind(this))
  }

  onData(data: IridiumDocument) {
    // this.emit('signal', { type: this.type, signalData: data, from: id })
  }

  isConnected() {
    return this.peer.connected
  }

  destroy() {
    this.unbindPeerListeners()
    this.peer.destroy()
  }
}
