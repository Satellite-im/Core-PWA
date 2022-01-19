import Peer, { SignalData } from 'simple-peer'
import { Config } from '~/config'
import Emitter from './Emitter'
import { TracksManager } from './TracksManager'
import { CallEventListeners, TrackKind } from './types'
import { Wire } from './Wire'

/**
 * @class Call
 * @description The Call class manages a p2p connection for audio/video calls
 * It makes use of a Wire as a communication bus for signaling.
 */
export class Call extends Emitter<CallEventListeners> {
  communicationBus: Wire

  peer?: Peer.Instance // The Simple Peer instance for the active call
  signalingBuffer?: Peer.SignalData // A variable to store the signaling data before the answer

  stream?: MediaStream // MediaStream for the active call
  remoteStream?: MediaStream // Remote stream received via WebRTC

  constraints: MediaStreamConstraints

  tracksManager: TracksManager // Keep tracks of all media stream tracks

  /**
   * @constructor
   * @param communicationBus The Wire instance used for signaling (it happens through p2p connection)
   */
  constructor(communicationBus: Wire) {
    super()

    this.communicationBus = communicationBus

    this.constraints = Config.webrtc.constraints

    this.tracksManager = new TracksManager()

    this._bindBusListeners()
  }

  /**
   * @method createLocalTracks
   * @description Generate local tracks for audio/video
   * @param kinds Array of track kind you want to create
   * @param constraints Media stream constraints to apply
   * @returns The created local tracks
   * @example
   * const call = new Call(wireInstance)
   * call.createLocalTracks({audio: true, video: true})
   */
  async createLocalTracks(
    kinds: TrackKind[],
    constraints?: MediaStreamConstraints,
  ) {
    if (!navigator.mediaDevices.getUserMedia) {
      throw new Error('WebRTC not supported')
    }

    if (constraints) {
      const constraintsUpdates = kinds.reduce(
        (updates, kind) => ({ ...updates, [kind]: constraints[kind] }),
        {},
      )
      this.updateConstraints(constraintsUpdates)
    }

    const constraintsToApply = kinds.reduce(
      (updates, kind) => ({ ...updates, [kind]: this.constraints[kind] }),
      {},
    )

    await navigator.mediaDevices.getUserMedia(constraintsToApply)
      .then((stream) => this.stream = stream )
      .catch((err) => {
         console.log(err)
      });

    const { audio, video } = this.getLocalTracks()

    if (audio) this.tracksManager.addTrack(audio)
    if (video) this.tracksManager.addTrack(video)

    if (audio) {
      this.emit('LOCAL_TRACK_CREATED', {
        peerId: this.communicationBus.identifier,
        track: audio,
      })
    }

    if (video) {
      this.emit('LOCAL_TRACK_CREATED', {
        peerId: this.communicationBus.identifier,
        track: video,
      })
    }

    return { audio, video }
  }

  /**
   * @method updateConstraints
   * @description Updates the constraints property
   * @param constraints Media stream contraints to apply from now on
   */
  updateConstraints(constraints: MediaStreamConstraints) {
    this.constraints = { ...this.constraints, ...constraints }
  }

  /**
   * @method getLocalTracks
   * @description Extract the local tracks from the stream
   * @returns the local tracks from the media stream
   */
  getLocalTracks() {
    if (!this.stream) {
      throw new Error('Stream not initialized')
    }

    const [audio] = this.stream.getAudioTracks()
    const [video] = this.stream.getVideoTracks()

    return { audio, video }
  }

  /**
   * @method getRemoteTracks
   * @description Extract the remote tracks from the remote stream
   * @returns the remote tracks from the media stream
   */
  getRemoteTracks() {
    if (!this.remoteStream) {
      throw new Error('Remote stream not initialized')
    }

    const [audio] = this.remoteStream.getAudioTracks()
    const [video] = this.remoteStream.getVideoTracks()

    return { audio, video }
  }

  /**
   * @method getTrackById
   * @description Returns a mediastreamtrack from the given id
   * @returns a mediastream track or undefined if not found
   */
  getTrackById(id: string): MediaStreamTrack | undefined {
    return this.tracksManager.getTrack(id)
  }

  /**
   * @method start
   * @description It's used for initiate a call
   * @param stream MediaStream object containing the audio/video tracks
   * @example
   * const call = new Call(wireInstance)
   * await call.createLocalTracks({audio: true, video: true})
   * call.start()
   */
  start() {
    if (!this.stream) {
      throw new Error('Local tracks not initialized. Create local tracks first')
    }

    // A new Simple Peer instance is created with the initiator flag set to true
    this.peer = new Peer({
      initiator: true,
      trickle: false,
      stream: this.stream,
    })
    this._bindPeerListeners()

    this.addTransceiver('audio')
    this.addTransceiver('video')

    this.emit('OUTGOING_CALL', { peerId: this.communicationBus.identifier })
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
  answer() {
    if (!this.signalingBuffer) {
      throw new Error('No call to answer')
    }

    if (!this.stream) {
      throw new Error('Local tracks not initialized. Create local tracks first')
    }

    // A new Simple Peer instance is created with the initiator flag set to false
    this.peer = new Peer({
      initiator: false,
      trickle: false,
      stream: this.stream,
    })
    this._bindPeerListeners()

    // Signal to the peer with previously received Signaling Data
    this.peer.signal(this.signalingBuffer)
  }

  deny() {
    if (!this.signalingBuffer) {
      console.warn('No call to deny')
      this.emit('HANG_UP', { peerId: this.communicationBus.identifier })
      return
    }

    this.communicationBus.send({
      type: 'REFUSE',
      payload: { peerId: this.communicationBus.identifier },
      sentAt: Date.now(),
    })
  }

  /**
   * @method hangUp
   * @description It's used to close the call
   * @example
   * const call = new Call(wireInstance)
   * call.hangUp()
   */
  hangUp() {
    this.peer?.destroy()
    this.stream?.getTracks().forEach((track) => track.stop())
    this.remoteStream?.getTracks().forEach((track) => track.stop())

    this.tracksManager.removeAllTracks()

    delete this.peer
    delete this.stream
  }

  /**
   * @method mute
   * @description Mute audio or video by removing the track of the given kind
   * @param kind Kind of the track to mute
   */
  async mute(kind: TrackKind) {
    if (!this.stream) {
      throw new Error('Stream not initialized. Create local tracks first')
    }

    const localTracks = this.getLocalTracks()

    if (localTracks[kind]) {
      this.removeTrack(localTracks[kind], this.stream)

      this.emit('LOCAL_TRACK_REMOVED', {
        peerId: this.communicationBus.identifier,
        track: localTracks[kind],
      })
    }
  }

  /**
   * @method unmute
   * @description Unmute audio or video by adding a new track of the given kind
   * @param kind Kind of the track to unmute
   */
  async unmute(kind: TrackKind) {
    if (!this.stream) {
      throw new Error('Stream not initialized. Create local tracks first')
    }

    const localTracks = this.getLocalTracks()

    if (localTracks[kind]) {
      throw new Error('Track already present')
    }

    const constraints = { [kind]: this.constraints[kind] }

    const newTracks = await this.createLocalTracks([kind], constraints)

    this.addTrack(newTracks[kind], this.stream)
  }

  /**
   * @method addStream
   * @description Adds a stream to the call
   * @param stream MediaStream to add
   * @example
   * const call = new Call(wireInstance)
   * call.addStream(mediaStream)
   */
  addStream(stream: MediaStream) {
    this.peer?.addStream(stream)
  }

  /**
   * @method removeStream
   * @description Removes a stream from the call
   * @param stream MediaStream to remove
   * @example
   * const call = new Call(wireInstance)
   * call.removeStream(mediaStream)
   */
  removeStream(stream: MediaStream) {
    this.peer?.removeStream(stream)
  }

  /**
   * @method addTrack
   * @description Adds a track to the call
   * @param track MediaStreamTrack to add
   * @param stream Related stream
   * @example
   * const call = new Call(wireInstance)
   * call.addTrack(newTrack, mediaStream)
   */
  addTrack(track: MediaStreamTrack, stream: MediaStream) {
    this.peer?.addTrack(track, stream)
    this.tracksManager.addTrack(track)
    stream.addTrack(track)
  }

  /**
   * @method removeTrack
   * @description Removes a track from the call
   * @param track MediaStreamTrack to remove
   * @param stream Related stream
   * @example
   * const call = new Call(wireInstance)
   * call.removeTrack(trackToRemove, mediaStream)
   */
  removeTrack(track: MediaStreamTrack, stream: MediaStream) {
    track.stop()
    this.peer?.removeTrack(track, stream)
    stream.removeTrack(track)
    this.tracksManager.removeTrack(track.id)
  }

  /**
   * @method replaceTrack
   * @description Replaces a track with a new one
   * @param oldTrack old MediaStreamTrack to remove
   * @param newTrack new MediaStreamTrack to add
   * @param stream Related stream
   * @example
   * const call = new Call(wireInstance)
   * call.replaceTrack(trackToRemove, trackToAdd, mediaStream)
   */
  replaceTrack(
    oldTrack: MediaStreamTrack,
    newTrack: MediaStreamTrack,
    stream: MediaStream,
  ) {
    this.peer?.replaceTrack(oldTrack, newTrack, stream)
    this.tracksManager.removeTrack(oldTrack.id)
    this.tracksManager.addTrack(newTrack)
  }

  /**
   * @method toggleTracks
   * @description Enable and disable tracks
   * @param kind Kinds of tracks (video or audio) to disable
   * @example this.toggleTracks('audio')
   */
   toggleTracks(kind: string, enabled: boolean) {
    const tracks = this.tracksManager.tracks
    for (let key in tracks) {
      let track = tracks[key]
      console.log(track)
      if (track.kind === kind) {
        track.enabled = enabled
      }
    }
  }

  /**
   * @method addTransceiver
   * @description Add a RTCRtpTransceiver to the connection
   * @param kind A MediaStreamTrack to associate with the transceiver, or a DOMString which is used as the kind of the receiver's track, and by extension of the RTCRtpReceiver itself.
   * @param init An object that conforms to the RTCRtpTransceiverInit dictionary which provides any options that you may wish to specify when creating the new transceiver.
   * @example
   */
  addTransceiver(kind: string) {
    this.peer?.addTransceiver(kind, undefined)
  }

  /**
   * @method _bindPeerListeners
   * @description Internal function to bind listeners to the communiciationBus events
   * @example
   * this._bindBusListeners()
   */
  protected _bindBusListeners() {
    this.communicationBus?.on('SIGNAL', this._onBusSignal.bind(this))
    this.communicationBus?.on('REFUSE', this._onBusRefuse.bind(this))
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
    const trackMuteListener = () => {
      this.tracksManager.removeTrack(track.id)

      track.removeEventListener('mute', trackMuteListener)

      this.emit('REMOTE_TRACK_REMOVED', {
        peerId: this.communicationBus.identifier,
        track,
        stream,
      })
    }

    track.addEventListener('mute', trackMuteListener)

    this.tracksManager.addTrack(track)
    this.emit('REMOTE_TRACK_RECEIVED', {
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
    this.remoteStream = stream
    this.emit('STREAM', { peerId: this.communicationBus.identifier, stream })
  }

  /**
   * @method _onClose
   * @description Callback for the Simple Peer close event
   */
  protected _onClose() {
    this.hangUp()
    delete this.signalingBuffer
    this.emit('HANG_UP', { peerId: this.communicationBus.identifier })
  }

  /**
   * @method _onBusSignal
   * @description Callback for the Wire on signal event
   * @param message Wire Message containing the signal data
   */
  protected _onBusSignal(message: { peerId: string; data: SignalData }) {
    if (message.data.type === 'offer' && !this.signalingBuffer) {
      this.signalingBuffer = message.data
      this.emit('INCOMING_CALL', { peerId: this.communicationBus.identifier })
    } else {
      this.peer?.signal(message.data)
    }
  }

  /**
   * @method _onBusRefuse
   * @description Callback for the Wire on refuse event. Used for the hang up
   * before the call started
   */
  protected _onBusRefuse() {
    this._onClose()
  }
}
