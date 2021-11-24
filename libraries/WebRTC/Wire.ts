import { isRight } from 'fp-ts/lib/Either'
import P2PT from 'p2pt'
import Peer from 'simple-peer'
import Emitter from '~/libraries/WebRTC/Emitter'
import {
  WireEventListeners,
  WireEvents,
  WireIdentificationMessage,
  WireMessage,
  WireMessageTypes,
} from '~/libraries/WebRTC/types'
import { wireIdentificationMessage } from './Encoders'

/**
 * @description A wire is a connection between peers on a specific channel.
 * In the 1 to 1 connection we will use a deterministic generated secret between
 * 2 parties as channel id.
 * For group calls we can use a channel id that is shared across the group
 */
export class Wire extends Emitter<WireEventListeners> {
  identifier: string
  channel: string
  instance: P2PT
  peer?: Peer.Instance

  constructor(
    identifier: string,
    channel: string,
    announceURLs: string[] = []
  ) {
    super()

    this.identifier = identifier
    this.channel = channel

    // Create a new P2PT instance using the channel as identifier
    // This way any other peer with the same identifier will be announced
    // by webtorrent trackers. We are going to use an ECDH shared secret between 2
    // parties to connect them
    this.instance = new P2PT(announceURLs, channel)

    this._bindListeners()
  }

  _bindListeners() {
    this.instance.on('trackerconnect', this._onTrackerConnect.bind(this))

    this.instance.on('peerconnect', (peer: Peer.Instance) => {
      peer.on('connect', this._onPeerConnect.bind(this))
      peer.on('error', this._onError.bind(this))
      peer.on('data', this._onData.bind(this))
      peer.on('track', this._onTrack.bind(this))
      peer.on('stream', this._onStream.bind(this))
      peer.on('close', this._onClose.bind(this))

      this.peer = peer

      const identificationMessage: WireIdentificationMessage = {
        type: WireMessageTypes.IDENTIFICATION,
        payload: { peerId: this.identifier },
        sentAt: Date.now(),
      }

      // Immediately send an identification message to let
      // the peer know what is the identifier
      // TODO: use a signed message for the future
      peer.send(JSON.stringify(identificationMessage))

      this._onPeerConnect()
    })

    this.instance.start()
  }

  _onTrackerConnect(tracker: any) {
    console.log('tracker', tracker)
    this.emit(WireEvents.TRACKER_CONNECT, { tracker: '' })
  }

  _onPeerConnect() {
    this.emit(WireEvents.CONNECT, { peerId: this.identifier })
  }

  _onError(error: Error) {
    this.emit(WireEvents.ERROR, { peerId: this.identifier, error })
  }

  _onData(data: any) {
    const decoder = new TextDecoder()
    const decodedString = decoder.decode(data)
    const parsedData = JSON.parse(decodedString)

    if (!parsedData.type) {
      return
    }

    switch (parsedData.type) {
      case WireMessageTypes.IDENTIFICATION: {
        const result = wireIdentificationMessage.decode(parsedData)

        if (isRight(result)) {
          this.emit(WireEvents.IDENTIFICATION, {
            peerId: result.right.payload.peerId,
          })
        } else {
          console.log('not identified, DESTROY')
        }
      }
      case WireMessageTypes.START_CALL: {
        console.log(
          'It should never happen because it is up to the other party'
        )
      }
      default: {
        this.emit(WireEvents.DATA, { peerId: this.identifier, data })
      }
    }
  }

  _onTrack(track: MediaStreamTrack, stream: MediaStream) {
    this.emit(WireEvents.TRACK, { peerId: this.identifier, track, stream })
  }

  _onStream(stream: MediaStream) {
    this.emit(WireEvents.STREAM, { peerId: this.identifier, stream })
  }

  _onClose() {
    this.emit(WireEvents.CLOSE, { peerId: this.identifier })
  }

  closeAll() {
    this.peer?.removeAllListeners()
    this.peer?.destroy()
    this.instance.removeAllListeners()
    this.instance.destroy()

    this.emit(WireEvents.CLOSE, { peerId: this.identifier })
  }

  send(message: WireMessage) {
    this.peer?.send(JSON.stringify(message))
  }
}
