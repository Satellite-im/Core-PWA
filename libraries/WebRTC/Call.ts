import Peer, { SignalData } from 'simple-peer'
import Emitter from './Emitter'
import { CallEventListeners } from './types'
import { Wire } from './Wire'

/**
 * @class Call
 * @description The Call class manages a p2p connection for audio/video calls
 * It makes use of a Wire as a communication bus for signaling.
 */
export class Call extends Emitter<CallEventListeners> {
  peer?: Peer.Instance // The Simple Peer instance for the active call
  communicationBus: Wire // The Wire instance used for signaling (it happens through p2p connection)
  signalingBuffer?: Peer.SignalData // A variable to store the signaling data before the answer

  constructor(communicationBus: Wire) {
    super()

    this.communicationBus = communicationBus

    this._bindBusListeners()
  }

  /**
   * @method start
   * @description It's used for initiate a call
   * @param stream MediaStream object containing the audio/video tracks
   * @example
   * const call = new Call(wireInstance)
   * call.start(mediaStream)
   */
  start(stream: MediaStream) {
    // A new Simple Peer instance is created with the initiator flag set to true
    this.peer = new Peer({ initiator: true, trickle: false, stream })
    this._bindPeerListeners()
  }

  /**
   * @method answer
   * @description It's used for answering a call. A call request must be active before
   * to call this method
   * @param stream MediaStream object containing the audio/video stream
   * @example
   * const call = new Call(wireInstance)
   * call.answer(mediaStream)
   */
  answer(stream: MediaStream) {
    if (!this.signalingBuffer) {
      throw new Error('No call to answer')
    }

    // A new Simple Peer instance is created with the initiator flag set to false
    this.peer = new Peer({ initiator: false, trickle: false, stream })
    this._bindPeerListeners()

    // Signal to the peer with previously received Signaling Data
    this.peer.signal(this.signalingBuffer)
  }

  /**
   * @method _bindPeerListeners
   * @description Internal function to bind listeners to the communiciationBus events
   * @example
   * this._bindBusListeners()
   */
  protected _bindBusListeners() {
    this.communicationBus?.on('SIGNAL', this._onBusSignal.bind(this))
  }

  /**
   * @method _bindPeerListeners
   * @description Internal function to bind listeners to the main peer events
   * @example
   * this._bindPeerListeners()
   */
  protected _bindPeerListeners() {
    this.peer?.on('signal', this._onSignal.bind(this))
    this.peer?.on('connect', this._onConnect.bind(this))
    this.peer?.on('error', this._onError.bind(this))
    this.peer?.on('track', this._onTrack.bind(this))
    this.peer?.on('stream', this._onStream.bind(this))
    this.peer?.on('close', this._onClose.bind(this))
  }

  /**
   * @method _onSignal
   * @description Callback for the Simple Peer signal event
   * @param data Simple Peer signaling data
   */
  protected _onSignal(data: Peer.SignalData) {
    this._sendSignal(data)
  }

  /**
   * @method _sendSignal
   * @description Sends the signaling data through the communication bus
   * @param data Signaling data to send
   */
  protected _sendSignal(data: Peer.SignalData) {
    if (!this.communicationBus) {
      throw new Error('Communication bus not found')
    }

    this.communicationBus.send({
      type: 'SIGNAL',
      payload: {
        peerId: this.communicationBus.identifier,
        data,
      },
      sentAt: Date.now(),
    })
  }

  /**
   * @method _onConnect
   * @description Callback for the Simple Peer signal event
   */
  protected _onConnect() {
    this.emit('CONNECTED', { peerId: this.communicationBus.identifier })
  }

  /**
   * @method _onError
   * @description Callback for the Simple Peer error event
   */
  protected _onError(error: Error) {
    this.emit('ERROR', { peerId: this.communicationBus.identifier, error })
  }

  /**
   * @method _onTrack
   * @description Callback for the Simple Peer track event
   * @param track MediaStreamTrack object for the audio/video tracks
   * @param stream MediaStream object for the audio/video stream
   */
  protected _onTrack(track: MediaStreamTrack, stream: MediaStream) {
    this.emit('TRACK', {
      peerId: this.communicationBus.identifier,
      track,
      stream,
    })
  }

  /**
   * @method _onStream
   * @description Callback for the Simple Peer stream event
   * @param stream MediaStream object for the audio/video stream
   */
  protected _onStream(stream: MediaStream) {
    this.emit('STREAM', { peerId: this.communicationBus.identifier, stream })
  }

  /**
   * @method _onClose
   * @description Callback for the Simple Peer close event
   */
  protected _onClose() {
    this.emit('HANG_UP', { peerId: this.communicationBus.identifier })
  }

  /**
   * @method _onBusSignal
   * @description Callback for the Wire on signal event
   * @param message Wire Message containing the signal data
   */
  protected _onBusSignal(message: { peerId: string; data: SignalData }) {
    this.signalingBuffer = message.data

    if (message.data.type === 'offer') {
      this.emit('INCOMING_CALL', { peerId: this.communicationBus.identifier })
    } else {
      this.peer?.signal(this.signalingBuffer)
    }
  }
}
