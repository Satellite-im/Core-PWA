import Peer from 'simple-peer'
import { IridiumDocument, IridiumMessage } from '@satellite-im/iridium'
import Emitter from './Emitter'
import { WebRTCErrors } from './errors/Errors'
import { CallEventListeners } from './types'
import { Config } from '~/config'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Wire } from '~/libraries/WebRTC/Wire'
import logger from '~/plugins/local/logger'

const PERMISSION_DENIED_BY_SYSTEM = 'Permission denied by system'

export class CallPeer extends Peer {
  id: string
  name: string
  callId: string | undefined

  constructor(
    {
      id,
      name,
      callId,
    }: {
      id: string
      name: string
      callId: string | undefined
    },
    opts?: Peer.Options,
  ) {
    super(opts)
    this.callId = callId
    this.id = id
    this.name = name
  }
}

export type CallPeerStreams = { [kind: string]: MediaStream }
export type CallPeerDescriptor = {
  id: string
  name: string
}

/**
 * @class Call
 * @description The Call class manages a p2p connection for audio/video calls
 * It makes use of iridium as a communication bus for signaling.
 */
export class Call extends Emitter<CallEventListeners> {
  callId: string
  wire: Wire
  peerDetails: CallPeerDescriptor[] = []
  peers: { [did: string]: CallPeer } = {} // The Simple Peer instance for the active call
  peerConnected: { [key: string]: boolean } = {}
  peerDialingDisabled: { [key: string]: boolean } = {}
  screenStreams: { [did: string]: string } = {}
  streams: { [did: string]: CallPeerStreams } = {} // Remote stream received via WebRTC
  tracks: { [did: string]: Set<MediaStreamTrack> } = {} // Remote stream received via WebRTC
  peerPollingInterval: any
  peerPollingFrequency = 15000
  constraints: MediaStreamConstraints
  isCaller: { [did: string]: boolean } = {}
  isCallee: { [did: string]: boolean } = {}
  active: boolean = false
  _listener: any

  /**
   * @constructor
   * @param did The PeerID used for signaling (via iridium)
   */
  constructor(callId: string, wire: Wire, peers?: CallPeerDescriptor[]) {
    super()

    this.callId = callId

    this.wire = wire

    if (!iridium.id) {
      throw new Error('local peerId not found')
    }

    if (this.callId === iridium.id) {
      throw new Error('callId cannot be the same as localId')
    }

    this.constraints = Config.webrtc.constraints
    this.peerDetails = peers || []
    this._bindBusListeners()

    console.log('CALL', 'creating a new peer', callId)
  }

  /**
   * @method isDirectCall
   * @description Returns true if the call is direct, false otherwise
   * @returns {boolean}
   * @example
   * const isDirectCall = call.isDirectCall()
   */
  isDirectCall() {
    return this.callId?.indexOf('|') === -1
  }

  /**
   * @method requestPeerCalls
   * @description Send an iridium message requesting for the given dids to initiate a call
   */
  async requestPeerCalls(force = false) {
    await Promise.all(
      this.peerDetails.map(async ({ id: did }) => {
        if (did === iridium.id) {
          return
        }
        if (this.isCallee[did]) {
          return
        }

        this.isCaller[did] = true
        await this.sendPeerCallRequest(did, force)
        if (!this.peers[did]) {
          await this.initiateCall(did, this.isCaller[did])
        }
      }),
    )
  }

  /**
   * @method start
   * @description It's used for initiate a call
   * @param stream MediaStream object containing the audio/video tracks
   */
  async start() {
    if (!this.active) {
      clearInterval(this.peerPollingInterval)
      this.peerPollingInterval = setInterval(async () => {
        if (!this.active) return
        await this.requestPeerCalls()
      }, this.peerPollingFrequency)
      this.active = true
    }

    await this.requestPeerCalls(true)
  }

  /**
   * @method answer
   * @description It's used for answering a call. A call request must be active before
   * to call this method
   * @param stream MediaStream object containing the audio/video stream
   */
  async answer(did: string, data: Peer.SignalData) {
    this.isCallee[did] = true

    await this.initiateCall(did, false, data)
    await this.start()
  }

  /**
   * @method createPeer
   * @description Creates a new Simple Peer instance
   * @param id The PeerID of the peer
   * @param asCaller Initiate the call as a caller
   */
  createPeer(did: string, asCaller: boolean = false) {
    if (this.peers[did] || !iridium.id) {
      return
    }
    const pd = this.peerDetails.find((pd) => pd.id === did)
    if (!pd) {
      return
    }
    const peer = new CallPeer(
      { ...pd, callId: this.callId },
      {
        initiator: asCaller,
        streams: [
          this.streams[iridium.id]?.audio,
          this.streams[iridium.id]?.video,
        ].filter(Boolean),
        offerOptions: {
          offerToReceiveAudio: true,
          offerToReceiveVideo: true,
        },
        config: {
          iceServers: Config.webrtc.iceServers,
        },
      },
    )
    this.peers[did] = peer
    this.peerDialingDisabled[did] = false
    this._bindPeerListeners(peer)
    peer.addTransceiver('audio')
    peer.addTransceiver('video')
    return peer
  }

  /**
   * @method initiateCall
   * @description locally initiates a call to the given peer
   * @param did
   * @param asCaller boolean indicating if the local peer is the caller or not
   * @returns {Promise<void>}
   * @example
   * await call.initiateCall(did, true)
   */
  async initiateCall(
    did: string,
    asCaller: boolean = false,
    data?: Peer.SignalData,
  ) {
    if (!this.peers[did]) {
      this.createPeer(did, asCaller)
    }

    this.peerDialingDisabled[did] = !asCaller

    const peer = this.peers[did]
    if (!peer) {
      return
    }

    if (data) {
      await peer.signal(data)
      this.emit('ANSWERED', { did, callId: this.callId })
      return
    }

    this.emit('OUTGOING_CALL', { did, callId: this.callId })
  }

  /**
   * @method sendPeerCallRequest
   * @description Send a call request to the given peer
   * @param did
   * @returns {Promise<void>}
   * @example
   * await call.sendPeerCallRequest(did)
   */
  async sendPeerCallRequest(did: string, force = false) {
    if (!did) {
      return
    }
    if (!force && (this.peerConnected[did] || this.peerDialingDisabled[did])) {
      return
    }

    return this.wire.sendMessage(
      {
        type: 'call',
        callId: this.callId === did ? iridium.id : this.callId,
        peers: this.peerDetails,
        did,
        at: Date.now().valueOf(),
      },
      { recipients: [did] },
    )
  }

  /**
   * @method setCallId
   * @description Sets the callId of the current call
   * @param callId
   * @returns {void}
   * @example
   * call.setCallId(callId)
   */
  setCallId(callId: string) {
    this.callId = callId
  }

  /**
   * @method createLocalTracks
   * @description Generate local streams for audio/video/screen
   * @param kinds Array of track kinds you want to create
   * @param constraints Media stream constraints to apply
   * @returns The created streams
   * @example
   */
  async createLocalTracks(
    kinds: string[],
    constraints?: MediaStreamConstraints,
  ) {
    if (!navigator.mediaDevices.getUserMedia) {
      alert(
        "Your browser doesn't support or have permission to access your media devices. Please update your browser or review your security settings.",
      )
      throw new Error('WebRTC media not supported')
    }

    if (kinds.includes('screen')) {
      await this.createDisplayStream()
    }

    if (kinds.includes('audio')) {
      await this.createAudioStream(constraints?.audio)
    }

    if (kinds.includes('video')) {
      await this.createVideoStream(constraints?.video)
    }

    return this.streams
  }

  /**
   * @method createAudioStream
   * @description Create local audio stream and send it to remote peers
   * @param constraints Media stream constraints to apply
   * @returns {Promise<void>}
   * @example
   * await call.createAudioStream()
   */
  async createAudioStream(constraints?: MediaStreamConstraints['audio']) {
    if (!iridium.id) return

    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: constraints || true,
    })

    if (!this.streams[iridium.id]) {
      this.streams[iridium.id] = {}
    }
    if (!this.tracks[iridium.id]) {
      this.tracks[iridium.id] = new Set()
    }

    const audioTrack = audioStream.getAudioTracks()[0]
    this.streams[iridium.id].audio = audioStream
    this.tracks[iridium.id].add(audioTrack)

    // mute if needed
    if (iridium.webRTC.state.streamMuted[iridium.id]?.audio) {
      audioTrack.enabled = false
    }

    this.emit('LOCAL_TRACK_CREATED', {
      track: audioTrack,
      kind: 'audio',
      stream: audioStream,
    })

    await Promise.all(
      Object.values(this.peers).map(async (peer) => {
        try {
          peer.addTrack(audioTrack, audioStream)
        } catch (_) {}
      }),
    )
  }

  /**
   * @method createVideoStream
   * @description Create local video stream and send it to remote peers
   * @param constraints Media stream constraints to apply
   * @returns {Promise<void>}
   * @example
   * await call.createVideoStream()
   */
  async createVideoStream(constraints?: MediaStreamConstraints['video']) {
    if (!iridium.id) return
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: constraints || true,
    })
    if (!this.streams[iridium.id]) {
      this.streams[iridium.id] = {}
    }
    if (!this.tracks[iridium.id]) {
      this.tracks[iridium.id] = new Set()
    }

    const videoTrack = videoStream.getVideoTracks()[0]

    this.streams[iridium.id].video = videoStream
    this.tracks[iridium.id].add(videoTrack)

    // mute if needed
    if (iridium.webRTC.state.streamMuted[iridium.id]?.audio) {
      videoTrack.enabled = false
    }

    this.emit('LOCAL_TRACK_CREATED', {
      track: videoTrack,
      kind: 'video',
      stream: videoStream,
    })

    await Promise.all(
      Object.values(this.peers).map(async (peer) => {
        try {
          peer.addTrack(videoTrack, videoStream)
        } catch (_) {}
      }),
    )
  }

  /**
   * @method createDisplayStream
   * @description Create local screen stream and send it to remote peers
   * @returns {Promise<void>}
   * @example
   * await call.createDisplayStream()
   */
  async createDisplayStream() {
    if (!navigator.mediaDevices.getDisplayMedia) {
      throw new Error(WebRTCErrors.PERMISSION_DENIED)
    }
    if (!iridium.id) return
    let screenStream: MediaStream

    try {
      screenStream = await navigator.mediaDevices.getDisplayMedia()
    } catch (e) {
      if (
        e instanceof DOMException &&
        e.message.includes(PERMISSION_DENIED_BY_SYSTEM)
      ) {
        throw new Error(WebRTCErrors.PERMISSION_DENIED)
      }
      return
    }

    if (!this.streams[iridium.id]) {
      this.streams[iridium.id] = {}
    }
    if (!this.tracks[iridium.id]) {
      this.tracks[iridium.id] = new Set()
    }

    const screenTrack = screenStream.getVideoTracks()[0]
    screenTrack.enabled = true

    screenTrack.addEventListener('ended', (event) => {
      this.mute({ kind: 'screen', did: iridium.id })
    })

    this.screenStreams[iridium.id] = screenStream.id
    this.streams[iridium.id].screen = screenStream
    this.tracks[iridium.id].add(screenTrack)

    // mute if needed
    if (iridium.webRTC.state.streamMuted.video) {
      screenTrack.enabled = false
    }

    this.emit('LOCAL_TRACK_CREATED', {
      track: screenTrack,
      kind: 'screen',
      stream: screenStream,
    })

    await Promise.all(
      Object.values(this.peers).map(async (peer) => {
        this.wire.sendMessage(
          {
            type: 'peer:screenshare',
            did: iridium.id,
            streamId: screenStream.id,
            trackId: screenTrack.id,
            at: Date.now().valueOf(),
          },
          { recipients: [peer.id] },
        )

        try {
          peer.addTrack(screenTrack, screenStream)
        } catch (_) {}
      }),
    )
  }

  /**
   * @method createNewTracks
   * @description Creates new media stream and returns tracks
   * @param constraints Media stream constraints to apply
   */
  async createNewTracks(constraints: MediaStreamConstraints) {
    if (!navigator.mediaDevices.getUserMedia) {
      alert(
        "Your browser doesn't support or have permission to access your media devices. Please update your browser or review your security settings.",
      )
      throw new Error('WebRTC not supported')
    }

    if (constraints.audio) {
      await this.createAudioStream(constraints.audio)
    }

    if (constraints.video) {
      await this.createVideoStream(constraints.video)
    }

    if (this.streams[iridium.id].screen) {
      await this.createDisplayStream()
    }
  }

  /**
   * @method updateConstraints
   * @description Updates the constraints property
   * @param constraints Media stream constraints to apply from now on
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
    return this.tracks[iridium.id]
  }

  /**
   * @method getRemoteTracks
   * @description Extract the remote tracks from the remote stream
   * @returns the remote tracks from the media stream
   */
  getRemoteTracks() {
    return Object.keys(this.tracks)
      .filter((did) => did !== iridium.id)
      .map((did) => this.tracks[did])
      .reduce(
        (acc: MediaStreamTrack[], tracks) => acc.concat(Object.values(tracks)),
        [],
      )
  }

  /**
   * @method getTrack
   * @description Get the given track from the local or remote stream
   * @param trackId
   * @returns {MediaStreamTrack} the track
   */
  getTrack(trackId: string) {
    Object.values(this.tracks).forEach((tracks) => {
      tracks.forEach((track) => {
        if (track.id === trackId) {
          return track
        }
      })
    })
    return null
  }

  /**
   * @method allRemoteStreams
   * @description get all remote streams
   * @returns {{ [did: string]: { [kind: string]: MediaStream } }}
   * @example
   * const remoteStreams = call.allRemoteStreams()
   */
  allRemoteStreams() {
    return Object.keys(this.streams)
      .filter((did) => did !== iridium.id)
      .map((did) => this.streams[did])
  }

  /**
   * @method getRemoteStreams
   * @description get remote streams of a given type
   * @param kind
   * @returns {{ [did: string]: MediaStream }}
   * @example
   * const remoteStreams = call.getRemoteStreams('video')
   */
  getRemoteStreams(kind: string) {
    return Object.keys(this.streams)
      .filter((did) => did !== iridium.id)
      .map((did) => this.streams[did]?.[kind])
  }

  /**
   * @method getLocalStreams
   * @description get all local streams
   * @returns {{ [kind: string]: MediaStream }}
   * @example
   * const localStreams = call.getLocalStreams()
   */
  getLocalStreams() {
    return this.streams[iridium.id]
  }

  /**
   * @method getLocalStream
   * @description get local stream of a given type
   * @param kind
   * @returns {MediaStream}
   * @example
   * const localStream = call.getLocalStream('video')
   */
  getLocalStream(kind: string) {
    return this.streams[iridium.id]?.[kind]
  }

  /**
   * @method getPeerStreams
   * @description get all streams of a given peer
   * @param did
   * @returns {{ [kind: string]: MediaStream }}
   * @example
   * const peerStreams = call.getPeerStreams(did)
   */
  getPeerStreams(did: string) {
    return this.streams[did]
  }

  /**
   * @method getPeerStream
   * @description get stream of a given peer and type
   * @param did
   * @param kind
   * @returns {MediaStream}
   * @example
   * const peerStream = call.getPeerStream(did, 'video')
   */
  getPeerStream(did: string, kind: string) {
    return this.streams[did]?.[kind]
  }

  /**
   * @method hasLocalStream
   * @description check if any local stream is available
   * @returns {boolean}
   * @example
   * const hasLocalStream = call.hasLocalStream()
   */
  hasLocalStream() {
    return Object.entries(this.streams[iridium.id] || {}).length > 0
  }

  /**
   * @method hasRemoteStream
   * @description check if any remote stream is available
   * @returns {boolean}
   * @example
   * const hasRemoteStream = call.hasRemoteStream()
   */
  hasRemoteStream() {
    return this.allRemoteStreams().length > 0
  }

  /**
   * @method hasRemoteTracks
   * @description check if any remote track is available
   * @returns {boolean}
   * @example
   * const hasRemoteTracks = call.hasRemoteTracks()
   */
  hasRemoteTracks() {
    return this.getRemoteTracks().length > 0
  }

  /**
   * @method deny
   * @description Signals to peer that we are denying their incoming call
   * @example call.deny()
   */
  async deny() {
    await Promise.all(
      this.peerDetails
        .filter((p) => p.id !== iridium.id)
        .map(async (peer) => {
          this.wire.sendMessage(
            {
              type: 'peer:hangup',
              did: iridium.id,
              callId: this.callId,
              at: Date.now().valueOf(),
            },
            { recipients: [peer.id] },
          )
        }),
    )
    this.closeStreams()
  }

  /**
   * @method hangUp
   * @description Hangs up active webrtc call
   * @example call.hangUp()
   */
  async hangUp() {
    this.deny()
    this.emit('HANG_UP', {
      callId: this.callId,
      did: iridium.id,
    })

    this.destroy()
  }

  closeStreams() {
    Object.values(this.tracks).forEach((peerTracks) => {
      peerTracks.forEach((track) => {
        track.stop()
      })
    })
    Object.values(this.streams).forEach((peerStreams) => {
      Object.values(peerStreams).forEach((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop()
        })
      })
    })
    this.streams = {}
    this.tracks = {}
  }

  /**
   * @method destroy
   * @description Destroys peer instance and all related streams and tracks
   * @example call.destroy()
   */
  async destroy(andDeny = true, andEmit = true) {
    if (andDeny) {
      this.deny()
    }
    this.active = false
    this.isCallee = {}
    this.isCaller = {}
    clearInterval(this.peerPollingInterval)
    this.peerDialingDisabled = {}
    Object.values(this.peers).forEach((peer) => {
      this.destroyPeer(peer.id)
    })
    this._unbindBusListeners()
    this.peers = {}
    if (andEmit) {
      this.emit('DESTROY', {
        callId: this.callId,
        did: iridium.id,
      })
    }
  }

  /**
   * @method mute
   * @description Mute audio or video by removing the track of the given kind
   * @param kind Kind of the track to mute
   */
  async mute({
    kind = 'audio',
    did = iridium.id,
  }: {
    kind: string
    did?: string
  }) {
    if (!did) return
    const stream = this.streams[did]?.[kind]
    if (!stream) {
      throw new Error(
        `webrtc/call: mute - ${kind} stream not initialized for peer: ${did}`,
      )
    }

    iridium.webRTC.setStreamMuted(did, { [kind]: true })
    let track: MediaStreamTrack
    if (kind === 'audio') {
      track = stream.getAudioTracks()[0]
      track.enabled = false
    } else if (kind === 'screen') {
      track = stream.getVideoTracks()[0]
      track.enabled = false
      track.stop()
      delete this.streams[did].screen
    } else {
      track = stream.getVideoTracks()[0]
      track.enabled = false
      track.stop()
      stream.removeTrack(track)
      delete this.streams[did]?.[kind]
    }

    // tell all of the peers that we muted the track
    if (did === iridium.id) {
      await Promise.all(
        Object.values(this.peers).map((peer) =>
          this.wire.sendMessage(
            {
              type: 'peer:mute',
              did: iridium.id,
              callId: this.callId === peer.id ? iridium.id : this.callId,
              trackId: track.id,
              kind,
              at: Date.now().valueOf(),
            },
            { recipients: [peer.id] },
          ),
        ),
      )
      this.emit('LOCAL_TRACK_REMOVED', {
        track,
        kind,
        stream,
      })
    }
  }

  /**
   * @method unmute
   * @description Unmute audio or video by adding a new track of the given kind
   * @param kind Kind of the track to unmute
   */
  async unmute({
    kind,
    did = iridium.id,
    constraints,
  }: {
    kind: string
    did?: string
    constraints: MediaStreamConstraints
  }) {
    if (!did) return

    iridium.webRTC.setStreamMuted(did, { [kind]: false })
    if (did === iridium.id) {
      if (kind === 'audio' && !this.streams[did]?.audio) {
        await this.createAudioStream(constraints?.audio)
      } else if (
        kind === 'video' &&
        !this.streams[did]?.video?.getVideoTracks()?.length
      ) {
        await this.createVideoStream(constraints?.video)
      } else if (kind === 'screen' && !this.streams[did]?.screen) {
        await this.createDisplayStream()
      }
    }

    const stream = this.streams[did]?.[kind]
    if (!stream) {
      return
    }

    const track: MediaStreamTrack =
      kind === 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0]
    track.enabled = true

    if (did !== iridium.id) {
      return
    }

    await Promise.all(
      Object.values(this.peers).map((peer) =>
        this.wire.sendMessage(
          {
            type: 'peer:unmute',
            did: iridium.id,
            callId: this.callId === peer.id ? iridium.id : this.callId,
            trackId: track.id,
            kind,
            at: Date.now().valueOf(),
          },
          { recipients: [peer.id] },
        ),
      ),
    )

    // tell all of the peers that we unmuted the track
    this.emit('LOCAL_TRACK_UNMUTED', {
      track,
      kind,
      stream,
    })
  }

  /**
   * @method addTransceiver
   * @description Add a RTCRtpTransceiver to the connection
   * @param kind A MediaStreamTrack to associate with the transceiver, or a DOMString which is used as the kind of the receiver's track, and by extension of the RTCRtpReceiver itself.
   * @param init An object that conforms to the RTCRtpTransceiverInit dictionary which provides any options that you may wish to specify when creating the new transceiver.
   * @example
   */
  addTransceiver(kind: string) {
    Object.values(this.peers).forEach((peer) => {
      peer.addTransceiver(kind, undefined)
    })
  }

  /**
   * @method _bindPeerListeners
   * @description Internal function to bind listeners to the communiciationBus events
   * @example
   * this._bindBusListeners()
   */
  protected _bindBusListeners() {
    this._listener = this._bindEventListeners.bind(this)
    this.wire.on('wire:message', this._bindEventListeners.bind(this))
  }

  /**
   * @method _bindEventListeners
   * @description Internal function to bind listeners to the corresponding events
   * @example
   * this._bindEventListeners();
   */
  protected _bindEventListeners({
    type,
    message,
  }: {
    type: string
    message: IridiumMessage<IridiumDocument>
  }) {
    logger.debug('Call', `Message received from ${type}`, { message })
    switch (message.payload.body.type) {
      case 'peer:signal':
        this._onBusSignal(message)
        break
      case 'peer:refuse':
        this._onBusRefuse()
        break
      case 'peer:hangup':
        this._onBusHangup(message)
        break
      case 'peer:screenshare':
        this._onBusScreenshare(message)
        break
      case 'peer:mute':
        this._onBusMute(message)
        break
      case 'peer:unmute':
        this._onBusUnmute(message)
        break

      default:
        break
    }
  }

  /**
   * @method _unbindBusListeners
   * @description Internal function to unbind listeners to the communiciationBus events
   * @example
   * this._unbindBusListeners();
   */
  protected async _unbindBusListeners() {
    // iridium.connector?.pubsub.off('/webrtc/announce', this._listener)
    this.wire.off('wire:message', this._listener)
  }

  /**
   * @method _bindPeerListeners
   * @description Internal function to bind listeners to the main peer events
   * @example
   * this._bindPeerListeners()
   */
  protected _bindPeerListeners(peer: CallPeer) {
    peer.on('signal', this._onSignal.bind(this, peer))
    peer.on('connect', this._onConnect.bind(this, peer))
    peer.on('error', this._onError.bind(this, peer))
    peer.on('track', this._onTrack.bind(this, peer))
    peer.on('stream', this._onStream.bind(this, peer))
    peer.on('close', this._onClose.bind(this, peer))
  }

  /**
   * @method _unbindPeerListeners
   * @description Internal function to unbind listeners to the main peer events
   * @example
   * this._unbindPeerListeners()
   */
  protected _unbindPeerListeners(peer: CallPeer) {
    peer.off('signal', this._onSignal)
    peer.off('connect', this._onConnect)
    peer.off('error', this._onError)
    peer.off('track', this._onTrack)
    peer.off('stream', this._onStream)
    peer.off('close', this._onClose)
  }

  /**
   * @method _onSignal
   * @description Callback for the Simple Peer signal event
   * @param data Simple Peer signaling data
   */
  protected async _onSignal(peer: CallPeer, data: Peer.SignalData) {
    this._sendSignal(peer, data)
  }

  /**
   * @method _sendSignal
   * @description Sends the signaling data through the communication bus
   * @param data Signaling data to send
   */
  protected async _sendSignal(peer: CallPeer, data: Peer.SignalData) {
    if (!iridium.connector) {
      throw new Error('Communication bus not found')
    }

    this.wire.sendMessage(
      {
        type: 'peer:signal',
        did: iridium.id,
        callId: this.callId === peer.id ? iridium.id : this.callId,
        data,
        at: Date.now().valueOf(),
      },
      { recipients: [peer.id] },
    )
  }

  /**
  //  * @method send
  //  * @description send some data to connected peers
  //  * @param type
  //  * @param data
  //  * @returns {void}
  //  * @example
  //  * await call.send('foo', 'test')
  //  */
  // async send(type: string, data: any) {
  //   await Object.values(this.peers).map(async (peer) => {
  //     await peer.send({ did: iridium.id, type, ...data })
  //   })
  // }

  /**
   * @method _onConnect
   * @description Callback for the Simple Peer connect event
   */
  protected async _onConnect(peer: CallPeer) {
    this.emit('CONNECTED', {
      callId: this.callId,
      did: peer.id,
    })
    if (!this.screenStreams[iridium.id]) {
      return
    }

    // tell the peer to start screen sharing
    const screenStream = this.streams[iridium.id]?.screen
    const screenTrack = screenStream?.getVideoTracks()[0]

    this.wire.sendMessage(
      {
        type: 'peer:screenshare',
        did: iridium.id,
        streamId: screenStream.id,
        trackId: screenTrack.id,
        at: Date.now().valueOf(),
      },
      { recipients: [peer.id] },
    )
  }

  /**
   * @method _onError
   * @description Callback for the Simple Peer error event
   */
  protected _onError(peer: CallPeer, error: Error) {
    // FOR DEBUG
    console.error(`${error} CODE: ${error.code}`)
    this.emit('ERROR', { did: peer.id, error })
  }

  /**
   * @method _onTrack
   * @description Callback for the Simple Peer track event
   * @param track MediaStreamTrack object for the audio/video tracks
   * @param stream MediaStream object for the audio/video stream
   */
  protected _onTrack(
    peer: CallPeer,
    track: MediaStreamTrack,
    stream: MediaStream,
  ) {
    if (!this.tracks[peer.id]) {
      this.tracks[peer.id] = new Set()
    }
    this.tracks[peer.id].add(track)

    this.peerConnected[peer.id] = true
    this.peerDialingDisabled[peer.id] = true
    this.emit('REMOTE_TRACK_RECEIVED', {
      did: peer.id,
      track,
      stream,
      kind: this.screenStreams[peer.id] === stream.id ? 'screen' : track.kind,
    })
  }

  /**
   * @method _onStream
   * @description Callback for the Simple Peer stream event
   * @param stream MediaStream object for the audio/video stream
   */
  protected _onStream(peer: CallPeer, stream: MediaStream) {
    if (!this.streams[peer.id]) {
      this.streams[peer.id] = {}
    }
    const kind =
      this.screenStreams[peer.id] === stream.id
        ? 'screen'
        : stream.getTracks()[0].kind
    this.streams[peer.id][kind] = stream
    this.emit('STREAM', { did: peer.id, stream, kind })
  }

  /**
   * @method _onClose
   * @description Callback for the Simple Peer close event
   */
  protected _onClose(peer: CallPeer) {
    this.peerConnected[peer.id] = false
    this._unbindPeerListeners(peer)
    this.destroyPeer(peer.id)
    delete this.peers[peer.id]
  }

  /**
   * @method _onBusSignal
   * @description Callback for the on signal event
   * @param message Message containing the signal data
   */
  protected async _onBusSignal({ payload }: { payload: any }) {
    const { did, data }: { did: string; data: Peer.SignalData } = payload.body
    if (
      data?.type === 'offer' &&
      !this.isCallee[did] &&
      !this.isCaller[did] &&
      !this.active
    ) {
      this.emit('INCOMING_CALL', {
        did,
        callId: this.callId,
        data,
      })
    }

    const peer = this.peers[did]
    if (!peer) {
      return
    }

    this.peerConnected[did] = true
    await peer.signal(data)
  }

  /**
   * @method destroyPeer
   * @description Destroy a peer
   * @param did
   * @returns {void}
   * @example
   * call.destroyPeer('did')
   */
  destroyPeer(did: string) {
    const peer = this.peers[did]
    if (peer) {
      peer.destroy()
    }

    if (this.streams[did]) {
      Object.values(this.streams[did]).forEach((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop()
        })
      })
      delete this.streams[did]
    }

    delete this.peers[did]
    delete this.peerConnected[did]
    delete this.isCaller[did]
    delete this.isCallee[did]

    this.peerDetails = this.peerDetails.filter((peer) => peer.id !== did)

    if (
      Object.values(this.peers).filter((p) => p.id !== iridium.id).length === 0
    ) {
      this.active = false
      this.destroy()
    }
  }

  /**
   * @method _onBusRefuse
   * @description Callback for the on refuse event. Used for the hang up
   * before the call started
   */
  protected _onBusRefuse() {
    this.deny()
  }

  /**
   * @method _onBusHangup
   * @description Callback for the on hangup event. Used for the hang up
   * after the call started
   */
  protected _onBusHangup({ payload }: { payload: any }) {
    const { did, callId } = payload.body

    this.peerDialingDisabled[did] = true
    this.isCallee[did] = false
    this.isCaller[did] = false
    this.destroyPeer(did)
  }

  /**
   * @method _onBusScreenshare
   * @description Callback for the on screenshare event
   * @param did
   * @param payload
   */

  protected _onBusScreenshare({ payload }: { payload: any }) {
    const { did, streamId, trackId } = payload.body
    const peer = this.peers[did]
    if (!peer) {
      return
    }
    // if the stream has already been stored as video, move it to screen
    if (this.streams[peer.id]?.video?.id === streamId) {
      this.streams[peer.id].screen = this.streams[peer.id].video
      delete this.streams[peer.id].video
    }
    this.screenStreams[peer.id] = streamId
  }

  /**
   * @method _onBusMute
   * @description Callback for the on mute event
   */
  protected _onBusMute({ payload }: { payload: any }) {
    const { did, trackId, kind } = payload.body

    Object.values(this.streams[did] || {}).forEach((stream) => {
      const track = stream.getTrackById(trackId)
      if (!track) return
      track.enabled = false
    })

    if (kind === 'video' || kind === 'screen') {
      delete this.streams[did]?.[kind]
    }

    this.emit('REMOTE_TRACK_MUTED', {
      did,
      kind,
      trackId,
    })
  }

  /**
   * @method _onBusMute
   * @description Callback for the on unmute event
   */
  protected _onBusUnmute({ payload }: { payload: any }) {
    const { did, trackId, kind } = payload.body

    Object.values(this.streams[did] || {}).forEach((stream) => {
      const track = stream.getTrackById(trackId)
      if (!track) return
      track.enabled = true
    })

    this.emit('REMOTE_TRACK_UNMUTED', {
      did,
      kind,
      trackId,
    })
  }
}
