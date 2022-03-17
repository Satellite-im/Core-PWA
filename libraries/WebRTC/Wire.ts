import { isRight } from 'fp-ts/lib/Either'
import P2PT from 'p2pt'
import Peer, { SignalData } from 'simple-peer'
import Vue from 'vue'
import Emitter from '~/libraries/WebRTC/Emitter'
import {
  WireEventListeners,
  WireIdentificationMessage,
  WireMessage,
} from '~/libraries/WebRTC/types'
import {
  wireDataMessage,
  wireIdentificationMessage,
  wireKeyboardState,
  wireRefuseConnectionMessage,
  wireSignalMessage,
} from './encoders'

/**
 * @description A wire is a connection between peers on a specific channel.
 * In the 1 to 1 connection we will use a deterministic generated secret between
 * 2 parties as channel id.
 */
export class Wire extends Emitter<WireEventListeners> {
  originator: string
  identifier: string
  channel: string
  sendIdentification: boolean

  instance: P2PT // P2PT Instance used for connecting peers through Web Torrent signaling servers
  peer?: Peer.Instance // Simple Peer object instantiated right after the connection occurred through p2pt library

  /**
   * @constructor
   * @param originator Identifier of the originator
   * @param identifier Identifier of the recipient
   * @param channel Secret communication channel you want to connect (shared secret between parties)
   * @param announceURLs Array of Web Torrent trackers for the signaling
   * @param sendIdentification Setting for enabling/disabling the identification mechanism
   * @example
   * const wire = new Wire('originator', 'identifier', 'secret_channel', ['announce_url_1', 'announce_url_1'], false);
   */
  constructor(
    originator: string,
    identifier: string,
    channel: string,
    announceURLs: string[] = [],
    sendIdentification: boolean = false,
  ) {
    super()

    this.originator = originator
    this.identifier = identifier
    this.channel = channel
    this.sendIdentification = sendIdentification

    // Create a new P2PT instance using the channel as identifier
    // This way any other peer with the same identifier will be announced
    // by webtorrent trackers. We are going to use an ECDH shared secret between 2
    // parties to connect them
    this.instance = new P2PT(announceURLs, channel)

    this._bindListeners()
  }

  /**
   * @method _bindListeners
   * @description Binds listeners for p2pt library
   * @example
   * this._bindListeners()
   */
  protected _bindListeners() {
    this.instance.on('trackerconnect', this._onTrackerConnect.bind(this))

    this.instance.on('peerconnect', this._onPeerConnect.bind(this))

    this.instance.start()
  }

  /**
   * @method _onTrackerConnect
   * @description Callback for the trackerconnect event provided by p2pt library
   * @param tracker Tracker information
   */
  protected _onTrackerConnect(tracker: any) {
    this.emit('TRACKER_CONNECT', { tracker })
  }

  /**
   * @method _onPeerConnect
   * @description Callback for the peerconnect event provided by p2pt library
   * @param peer Simple Peer instance
   */
  protected _onPeerConnect(peer: Peer.Instance) {
    peer.on('connect', this._onPeerConnect.bind(this))
    peer.on('error', this._onError.bind(this))
    peer.on('data', this._onData.bind(this))
    peer.on('close', this._onClose.bind(this))

    this.peer = peer
    this._onConnectionHappened(peer)
  }

  /**
   * @method _onConnectionHappened
   * @description Callback for the connect event provided by Simple Peer
   * @param peer Simple Peer instance
   */
  protected _onConnectionHappened(peer: Peer.Instance) {
    if (this.sendIdentification) {
      const identificationMessage: WireIdentificationMessage = {
        type: 'IDENTIFICATION',
        payload: { peerId: this.originator },
        sentAt: Date.now(),
      }

      // Immediately send an identification message to let
      // the peer know what is the identifier
      // TODO: use a signed message for the future - AP-404
      peer.send(JSON.stringify(identificationMessage))
    }

    this.emit('CONNECT', { peerId: this.identifier })
  }

  /**
   * @method _onError
   * @description Callback for the error event provided by Simple Peer
   * @param error Error received
   */
  protected _onError(error: Error) {
    this.emit('ERROR', { peerId: this.identifier, error })
  }

  /**
   * @method _onData
   * @description Callback for the data event provided by Simple Peer
   * @param data Data buffer received
   */
  protected _onData(data: Buffer) {
    const decoder = new TextDecoder()
    const decodedString = decoder.decode(data)
    const parsedData = JSON.parse(decodedString)

    const identificationMessage = wireIdentificationMessage.decode(parsedData)

    if (isRight(identificationMessage)) {
      const { peerId } = identificationMessage.right.payload

      if (peerId !== this.identifier) {
        Vue.prototype.$Logger.log('WebRTC', 'Not recognized, drop connection.')
      } else {
        Vue.prototype.$Logger.log('WebRTC', 'Identified')
      }

      this.emit('IDENTIFICATION', {
        peerId,
      })

      return
    }

    const signalMessage = wireSignalMessage.decode(parsedData)

    if (isRight(signalMessage)) {
      const { peerId, data } = signalMessage.right.payload

      this.emit('SIGNAL', {
        peerId,
        data: data as SignalData,
      })

      return
    }

    const dataMessage = wireDataMessage.decode(parsedData)

    if (isRight(dataMessage)) {
      const data = dataMessage.right.payload

      this.emit('DATA', {
        peerId: this.identifier,
        data,
      })

      return
    }

    const refuseMessage = wireRefuseConnectionMessage.decode(parsedData)

    if (isRight(refuseMessage)) {
      const data = refuseMessage.right.payload

      this.emit('REFUSE', {
        peerId: this.identifier,
      })

      return
    }

    const keyboardState = wireKeyboardState.decode(parsedData)

    if (isRight(keyboardState)) {
      this.emit('TYPING_STATE', {
        state: keyboardState.right.payload.state,
        peerId: this.identifier,
      })

      return
    }

    this.emit('RAW_DATA', {
      peerId: this.identifier,
      data: parsedData.payload,
    })
  }

  /**
   * @method _onClose
   * @description Callback for the close event provided by Simple Peer
   */
  protected _onClose() {
    this.emit('CLOSE', { peerId: this.identifier })
  }

  /**
   * @method destroy
   * @description Removes all the listeners and destroys all the peer
   * instances
   * @example
   * const wire = new Wire('originator', 'identifier', 'secret_channel', ['announce_url_1', 'announce_url_1'], false);
   * wire.destroy()
   */
  destroy() {
    this.peer?.removeAllListeners()
    this.peer?.destroy()
    this.instance.removeAllListeners()
    this.instance.destroy()

    this.emit('CLOSE', { peerId: this.identifier })
  }

  /**
   * @method send
   * @description Sends a message to the connected peer
   * @param message Wire Message to send
   * @example
   * const wire = new Wire('originator', 'identifier', 'secret_channel', ['announce_url_1', 'announce_url_1'], false);
   * wire.send({ type: 'SIGNAL', payload: { peerId: 'id', data }, sentAt: Date.now() })
   */
  send(message: WireMessage) {
    this.peer?.send(JSON.stringify(message))
  }
}
