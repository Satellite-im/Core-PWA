import Peer, { SignalData } from 'simple-peer'
import PeerId from 'peer-id'
import Emitter from './Emitter'
import { CallEventListeners } from './types'
import { Peer2Peer } from './Libp2p'
import { Config } from '~/config'

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
 * It makes use of libp2p as a communication bus for signaling.
 */
export class Call extends Emitter<CallEventListeners> {
  p2p: Peer2Peer
  localId: string
  callId: string
  peerDetails: CallPeerDescriptor[] = []
  peers: { [peerId: string]: CallPeer } = {} // The Simple Peer instance for the active call
  peerConnected: { [key: string]: boolean } = {}
  peerDialingDisabled: { [key: string]: boolean } = {}
  screenStreams: { [peerId: string]: string } = {}
  streams: { [peerId: string]: CallPeerStreams } = {} // Remote stream received via WebRTC
  tracks: { [peerId: string]: Set<MediaStreamTrack> } = {} // Remote stream received via WebRTC
  peerSignals: { [peerId: string]: Peer.SignalData } = {} // A variable to store the signaling data before the answer
  peerPollingInterval: any
  peerPollingFrequency = 15000
  constraints: MediaStreamConstraints
  isCaller: { [peerId: string]: boolean } = {}
  isCallee: { [peerId: string]: boolean } = {}
  active: boolean = false

  /**
   * @constructor
   * @param peerId The PeerID used for signaling (via libp2p)
   */
  constructor(
    callId: string,
    peers?: CallPeerDescriptor[],
    peerSignals: { [key: string]: SignalData } = {},
  ) {
    super()

    this.callId = callId
    this.p2p = Peer2Peer.getInstance()

    if (!this.p2p.peerId) {
      throw new Error('local peerId not found')
    }

    this.localId = this.p2p.peerId.toB58String()

    if (this.callId === this.localId) {
      throw new Error('callId cannot be the same as localId')
    }

    this.constraints = Config.webrtc.constraints
    this.peerDetails = peers || []
    this.peerSignals = peerSignals || {}
    this._bindBusListeners()
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
   * @description Send a libp2p message requesting for the given peerIds to initiate a call
   */
  async requestPeerCalls(force = false) {
    await Promise.all(
      this.peerDetails.map(async (peer) => {
        if (peer.id === this.localId) {
          return
        }
        if (this.isCallee[peer.id]) {
          return
        }

        this.isCaller[peer.id] = true
        if (!this.peers[peer.id]) {
          await this.initiateCall(peer.id, this.isCaller[peer.id])
        }
        await this.sendPeerCallRequest(peer.id, force)
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
  async answer(peerId: string) {
    await this.initiateCall(peerId, false)
    await this.start()
  }

  /**
   * @method createPeer
   * @description Creates a new Simple Peer instance
   * @param id The PeerID of the peer
   * @param asCaller Initiate the call as a caller
   */
  createPeer(peerId: string, asCaller: boolean = false) {
    if (this.peers[peerId]) {
      return
    }
    const pd = this.peerDetails.find((pd) => pd.id === peerId)
    if (!pd) {
      return
    }
    const peer = new CallPeer(
      { ...pd, callId: this.callId },
      {
        initiator: asCaller || !!this.peerSignals[peerId],
        streams: [
          this.streams[this.localId]?.audio,
          this.streams[this.localId]?.video,
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
    this.peers[peerId] = peer
    this.peerDialingDisabled[peerId] = false
    this._bindPeerListeners(peer)
    peer.addTransceiver('audio')
    peer.addTransceiver('video')
    return peer
  }

  /**
   * @method initiateCall
   * @description locally initiates a call to the given peer
   * @param peerId
   * @param asCaller boolean indicating if the local peer is the caller or not
   * @returns {Promise<void>}
   * @example
   * await call.initiateCall(peerId, true)
   */
  async initiateCall(peerId: string, asCaller: boolean = false) {
    if (!this.peers[peerId]) {
      this.createPeer(peerId, asCaller)
    }

    this.peerDialingDisabled[peerId] = !asCaller

    const peer = this.peers[peerId]
    if (!peer) {
      return
    }

    const signal = this.peerSignals[peerId]
    if (signal) {
      await peer.signal(signal)
      this.emit('ANSWERED', { peerId, callId: this.callId })
      return
    }

    this.emit('OUTGOING_CALL', { peerId, callId: this.callId })
  }

  /**
   * @method sendPeerCallRequest
   * @description Send a call request to the given peer
   * @param peerId
   * @returns {Promise<void>}
   * @example
   * await call.sendPeerCallRequest(peerId)
   */
  async sendPeerCallRequest(peerId: string, force = false) {
    if (!peerId) {
      return
    }
    if (
      !force &&
      (this.peerConnected[peerId] || this.peerDialingDisabled[peerId])
    ) {
      return
    }
    if (!this.peers[peerId]) {
      await this.initiateCall(peerId, true)
    }

    await this.p2p.sendMessage(
      {
        type: 'peer:call',
        payload: {
          callId: this.callId === peerId ? this.localId : this.callId,
          peers: this.peerDetails,
          signal: this.peerSignals[peerId],
        },
        sentAt: Date.now().valueOf(),
      },
      peerId,
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
      await this.createAudioStream(constraints?.audio || true)
    }

    if (kinds.includes('video')) {
      await this.createVideoStream(constraints?.video || true)
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
  async createAudioStream(
    constraints: MediaTrackConstraints | boolean | undefined,
  ) {
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: constraints || true,
    })
    if (!this.streams[this.localId]) {
      this.streams[this.localId] = {}
    }
    if (!this.tracks[this.localId]) {
      this.tracks[this.localId] = new Set()
    }

    const audioTrack = audioStream.getAudioTracks()[0]

    this.streams[this.localId].audio = audioStream
    this.tracks[this.localId].add(audioTrack)

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
  async createVideoStream(
    constraints: MediaTrackConstraints | boolean | undefined,
  ) {
    const videoStream = await navigator.mediaDevices.getUserMedia({
      video: constraints || true,
    })
    if (!this.streams[this.localId]) {
      this.streams[this.localId] = {}
    }
    if (!this.tracks[this.localId]) {
      this.tracks[this.localId] = new Set()
    }

    const videoTrack = videoStream.getVideoTracks()[0]

    this.streams[this.localId].video = videoStream
    this.tracks[this.localId].add(videoTrack)

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
      alert(
        "Your browser doesn't support or have permission to share your screen. Please update your browser or review your security settings.",
      )
      throw new Error('WebRTC display media not supported')
    }

    const screenStream = await navigator.mediaDevices.getDisplayMedia()
    if (!this.streams[this.localId]) {
      this.streams[this.localId] = {}
    }
    if (!this.tracks[this.localId]) {
      this.tracks[this.localId] = new Set()
    }

    const screenTrack = screenStream.getVideoTracks()[0]
    screenTrack.enabled = true

    await Promise.all(
      Object.values(this.peers).map(async (peer) => {
        await this.p2p.sendMessage(
          {
            type: 'peer:screenshare',
            payload: {
              streamId: screenStream.id,
              trackId: screenTrack.id,
            },
            sentAt: Date.now().valueOf(),
          },
          peer.id,
        )
        try {
          peer.addTrack(screenTrack, screenStream)
        } catch (_) {}
      }),
    )

    this.screenStreams[this.localId] = screenStream.id
    this.streams[this.localId].screen = screenStream
    this.tracks[this.localId].add(screenTrack)

    this.emit('LOCAL_TRACK_CREATED', {
      track: screenTrack,
      kind: 'screen',
      stream: screenStream,
    })
  }

  /**
   * @method createNewTracks
   * @description Creates new media stream and returns tracks
   * @param constraints Media stream contraints to apply
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

    if (this.streams[this.localId].screen) {
      await this.createDisplayStream()
    }
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
    return this.tracks[this.localId]
  }

  /**
   * @method getRemoteTracks
   * @description Extract the remote tracks from the remote stream
   * @returns the remote tracks from the media stream
   */
  getRemoteTracks() {
    return Object.keys(this.tracks)
      .filter((peerId) => peerId !== this.localId)
      .map((peerId) => this.tracks[peerId])
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
   * @returns {{ [peerId: string]: { [kind: string]: MediaStream } }}
   * @example
   * const remoteStreams = call.allRemoteStreams()
   */
  allRemoteStreams() {
    return Object.keys(this.streams)
      .filter((peerId) => peerId !== this.localId)
      .map((peerId) => this.streams[peerId])
  }

  /**
   * @method getRemoteStreams
   * @description get remote streams of a given type
   * @param kind
   * @returns {{ [peerId: string]: MediaStream }}
   * @example
   * const remoteStreams = call.getRemoteStreams('video')
   */
  getRemoteStreams(kind: string) {
    return Object.keys(this.streams)
      .filter((peerId) => peerId !== this.localId)
      .map((peerId) => this.streams[peerId]?.[kind])
  }

  /**
   * @method getLocalStreams
   * @description get all local streams
   * @returns {{ [kind: string]: MediaStream }}
   * @example
   * const localStreams = call.getLocalStreams()
   */
  getLocalStreams() {
    return this.streams[this.localId]
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
    return this.streams[this.localId]?.[kind]
  }

  /**
   * @method getPeerStreams
   * @description get all streams of a given peer
   * @param peerId
   * @returns {{ [kind: string]: MediaStream }}
   * @example
   * const peerStreams = call.getPeerStreams(peerId)
   */
  getPeerStreams(peerId: string) {
    return this.streams[peerId]
  }

  /**
   * @method getPeerStream
   * @description get stream of a given peer and type
   * @param peerId
   * @param kind
   * @returns {MediaStream}
   * @example
   * const peerStream = call.getPeerStream(peerId, 'video')
   */
  getPeerStream(peerId: string, kind: string) {
    return this.streams[peerId]?.[kind]
  }

  /**
   * @method hasLocalStream
   * @description check if any local stream is available
   * @returns {boolean}
   * @example
   * const hasLocalStream = call.hasLocalStream()
   */
  hasLocalStream() {
    return Object.entries(this.streams[this.localId] || {}).length > 0
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
      this.peerDetails.map(async (peer) => {
        await this.p2p.sendMessage(
          {
            type: 'peer:hangup',
            payload: { peerId: this.localId, callId: this.callId },
            sentAt: Date.now().valueOf(),
          },
          peer.id,
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
      peerId: this.localId,
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
  async destroy() {
    this.deny()
    this.peerSignals = {}
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
    this.emit('DESTROY', {
      callId: this.callId,
      peerId: this.localId,
    })
  }

  /**
   * @method mute
   * @description Mute audio or video by removing the track of the given kind
   * @param kind Kind of the track to mute
   */
  async mute({
    kind = 'audio',
    peerId = this.localId,
  }: {
    kind: string
    peerId?: string
  }) {
    const stream = this.streams[peerId]?.[kind]
    if (!stream) {
      throw new Error(
        `webrtc/call: mute - ${kind} stream not initialized for peer: ${peerId}`,
      )
    }

    let track: MediaStreamTrack
    if (kind === 'audio') {
      track = stream.getAudioTracks()[0]
      track.enabled = false
    } else if (kind === 'screen') {
      track = stream.getVideoTracks()[0]
      track.enabled = false
      track.stop()
      delete this.streams[peerId].screen
    } else {
      track = stream.getVideoTracks()[0]
      track.enabled = false
    }

    // tell all of the peers that we muted the track
    if (peerId === this.localId) {
      await Promise.all(
        Object.values(this.peers).map(async (peer) => {
          await this.p2p.sendMessage(
            {
              type: 'peer:mute',
              payload: {
                callId: this.callId === peer.id ? this.localId : this.callId,
                trackId: track.id,
                kind,
              },
              sentAt: Date.now().valueOf(),
            },
            peer.id,
          )
        }),
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
    peerId = this.localId,
  }: {
    kind: string
    peerId?: string
  }) {
    if (peerId === this.localId) {
      if (kind === 'audio' && !this.streams[peerId]?.audio) {
        await this.createAudioStream(true)
      } else if (kind === 'video' && !this.streams[peerId]?.video) {
        await this.createVideoStream(true)
      } else if (kind === 'screen' && !this.streams[peerId]?.screen) {
        await this.createDisplayStream()
      }
    }

    const stream = this.streams[peerId]?.[kind]
    if (!stream) {
      throw new Error(
        `webrtc/call: unmute - ${kind} stream not initialized for peer: ${peerId}`,
      )
    }

    const track: MediaStreamTrack =
      kind === 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0]
    track.enabled = true

    if (peerId !== this.localId) {
      return
    }

    // tell all of the peers that we unmuted the track
    this.emit('LOCAL_TRACK_CREATED', {
      track,
      kind,
      stream,
    })

    await Promise.all(
      Object.values(this.peers).map(async (peer) => {
        await this.p2p.sendMessage(
          {
            type: 'peer:unmute',
            payload: {
              callId: this.callId === peer.id ? this.localId : this.callId,
              trackId: track.id,
              kind,
            },
            sentAt: Date.now().valueOf(),
          },
          peer.id,
        )
      }),
    )
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
    this.p2p?.on('peer:signal', this._onBusSignal.bind(this))
    this.p2p?.on('peer:refuse', this._onBusRefuse.bind(this))
    this.p2p?.on('peer:hangup', this._onBusHangup.bind(this))
    this.p2p?.on('peer:screenshare', this._onBusScreenshare.bind(this))
    this.p2p?.on('peer:mute', this._onBusMute.bind(this))
    this.p2p?.on('peer:unmute', this._onBusUnmute.bind(this))
    this.p2p?.on('peer:destroy', this._onBusDestroy.bind(this))
  }

  /**
   * @method _unbindBusListeners
   * @description Internal function to unbind listeners to the communiciationBus events
   * @example
   * this._unbindBusListeners();
   */
  protected _unbindBusListeners() {
    this.p2p?.off('peer:signal', this._onBusSignal.bind(this))
    this.p2p?.off('peer:refuse', this._onBusRefuse.bind(this))
    this.p2p?.off('peer:hangup', this._onBusHangup.bind(this))
    this.p2p?.off('peer:screenshare', this._onBusScreenshare.bind(this))
    this.p2p?.off('peer:mute', this._onBusMute.bind(this))
    this.p2p?.off('peer:unmute', this._onBusUnmute.bind(this))
    this.p2p?.off('peer:destroy', this._onBusDestroy.bind(this))
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
    peer.removeAllListeners()
  }

  /**
   * @method _onSignal
   * @description Callback for the Simple Peer signal event
   * @param data Simple Peer signaling data
   */
  protected _onSignal(peer: CallPeer, data: Peer.SignalData) {
    this._sendSignal(peer, data)
  }

  /**
   * @method _sendSignal
   * @description Sends the signaling data through the communication bus
   * @param data Signaling data to send
   */
  protected async _sendSignal(peer: CallPeer, data: Peer.SignalData) {
    if (!this.p2p) {
      throw new Error('Communication bus not found')
    }

    await this.p2p.sendMessage(
      {
        type: 'SIGNAL',
        payload: {
          callId: this.callId === peer.id ? this.localId : this.callId,
          data,
        },
        sentAt: Date.now().valueOf(),
      },
      peer.id,
    )
  }

  /**
   * @method send
   * @description send some data to connected peers
   * @param type
   * @param data
   * @returns {void}
   * @example
   * await call.send('foo', 'test')
   */
  async send(type: string, data: any) {
    await Object.values(this.peers).map(async (peer) => {
      await peer.send({ peerId: this.localId, type, ...data })
    })
  }

  /**
   * @method _onConnect
   * @description Callback for the Simple Peer connect event
   */
  protected async _onConnect(peer: CallPeer) {
    this.emit('CONNECTED', {
      callId: this.callId,
      peerId: peer.id,
    })
    if (!this.screenStreams[this.localId]) {
      return
    }

    // tell the peer to start screen sharing
    const screenStream = this.streams[this.localId]?.screen
    const screenTrack = screenStream?.getVideoTracks()[0]
    await this.p2p.sendMessage(
      {
        type: 'peer:screenshare',
        payload: {
          streamId: screenStream.id,
          trackId: screenTrack.id,
        },
        sentAt: Date.now().valueOf(),
      },
      peer.id,
    )
  }

  /**
   * @method _onError
   * @description Callback for the Simple Peer error event
   */
  protected _onError(peer: CallPeer, error: Error) {
    this.emit('ERROR', { peerId: peer.id, error })
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
    const trackMuteListener = () => {
      this.emit('REMOTE_TRACK_REMOVED', {
        peerId: peer.id,
        track,
        stream,
        kind: this.screenStreams[peer.id] === stream.id ? 'screen' : track.kind,
      })
      track.removeEventListener('mute', trackMuteListener)
    }

    track.addEventListener('mute', trackMuteListener)
    if (!this.tracks[peer.id]) {
      this.tracks[peer.id] = new Set()
    }
    this.tracks[peer.id].add(track)

    this.peerConnected[peer.id] = true
    this.peerDialingDisabled[peer.id] = true
    this.emit('REMOTE_TRACK_RECEIVED', {
      peerId: peer.id,
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
    this.emit('STREAM', { peerId: peer.id, stream, kind })
  }

  /**
   * @method _onClose
   * @description Callback for the Simple Peer close event
   */
  protected _onClose(peer: CallPeer) {
    this.peerConnected[peer.id] = false
    this._unbindPeerListeners(peer)
    delete this.peers[peer.id]
  }

  /**
   * @method _onBusSignal
   * @description Callback for the on signal event
   * @param message Message containing the signal data
   */
  protected async _onBusSignal(message: { peerId: PeerId; payload: any }) {
    const peerHash = message.peerId.toB58String()
    this.peerSignals[peerHash] = message.payload.data
    if (
      message.payload?.data?.type === 'offer' &&
      !this.isCallee[peerHash] &&
      !this.isCaller[peerHash] &&
      !this.active
    ) {
      this.emit('INCOMING_CALL', {
        peerId: peerHash,
        callId: this.callId,
      })
    }

    const peer = this.peers[peerHash]
    if (!peer) {
      return
    }

    this.peerConnected[peerHash] = true
    await peer.signal(message.payload.data)
  }

  /**
   * @method destroyPeer
   * @description Destroy a peer
   * @param peerId
   * @returns {void}
   * @example
   * call.destroyPeer('peerId')
   */
  destroyPeer(peerId: string) {
    if (this.streams[peerId]) {
      Object.values(this.streams[peerId]).forEach((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop()
        })
      })
      delete this.streams[peerId]
    }
    const peer = this.peers[peerId]
    if (peer) {
      peer.destroy()
    }
    delete this.peers[peerId]
    delete this.peerConnected[peerId]
    delete this.peerSignals[peerId]
    delete this.isCaller[peerId]
    delete this.isCallee[peerId]

    this.peerDetails = this.peerDetails.filter((peer) => peer.id !== peerId)

    if (
      Object.values(this.peers).filter((p) => p.id !== this.localId).length ===
      0
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
  protected _onBusHangup({ peerId }: { peerId: PeerId }) {
    const peerHash = peerId.toB58String()
    this.peerDialingDisabled[peerHash] = true
    this.isCallee[peerHash] = false
    this.isCaller[peerHash] = false
    this.destroyPeer(peerHash)
  }

  /**
   * @method _onBusScreenshare
   * @description Callback for the on screenshare event
   * @param peerId
   * @param payload
   */
  protected _onBusScreenshare({
    peerId,
    payload: { streamId },
  }: {
    peerId: PeerId
    payload: { streamId: string }
  }) {
    const peer = this.peers[peerId.toB58String()]
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
  protected _onBusMute({
    peerId,
    payload: { kind, trackId },
  }: {
    peerId: PeerId
    payload: { kind: string; trackId: string }
  }) {
    const peerHash = peerId.toB58String()
    this.emit('REMOTE_TRACK_MUTED', {
      peerId: peerHash,
      kind,
      trackId,
    })
    Object.values(this.streams[peerId.toB58String()] || {}).forEach(
      (stream) => {
        const track = stream.getTrackById(trackId)
        if (!track) return
        track.enabled = false
      },
    )
  }

  /**
   * @method _onBusMute
   * @description Callback for the on unmute event
   */
  protected _onBusUnmute({
    peerId,
    payload: { kind, trackId },
  }: {
    peerId: PeerId
    payload: { kind: string; trackId: string }
  }) {
    const peerHash = peerId.toB58String()
    this.emit('REMOTE_TRACK_UNMUTED', {
      peerId: peerHash,
      kind,
      trackId,
    })
    Object.values(this.streams[peerId.toB58String()] || {}).forEach(
      (stream) => {
        const track = stream.getTrackById(trackId)
        if (!track) return
        track.enabled = true
      },
    )
  }

  /**
   * @method _onBusMute
   * @description Callback for the on destroy event
   */
  protected _onBusDestroy({ peerId }: { peerId: PeerId }) {
    this.destroyPeer(peerId.toB58String())
  }
}
