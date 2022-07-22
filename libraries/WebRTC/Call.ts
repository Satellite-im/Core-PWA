import Peer, { SignalData } from 'simple-peer'
import PeerId from 'peer-id'
import Emitter from './Emitter'
import { CallEventListeners } from './types'
import { WebRTCErrors } from './errors/Errors'
import { Config } from '~/config'

import iridium from '~/libraries/Iridium/IridiumManager'

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
   * @param peerId The PeerID used for signaling (via iridium)
   */
  constructor(
    callId: string,
    peers?: CallPeerDescriptor[],
    peerSignals: { [key: string]: SignalData } = {},
  ) {
    super()

    this.callId = callId

    if (!iridium.connector?.peerId) {
      throw new Error('local peerId not found')
    }

    if (this.callId === iridium.connector?.peerId) {
      throw new Error('callId cannot be the same as localId')
    }

    this.constraints = Config.webrtc.constraints
    this.peerDetails = peers || []
    this.peerSignals = peerSignals || {}
    this._bindBusListeners()
    this.subscribeToChannel()
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

  private subscribeToChannel = async () => {
    await iridium.connector?.subscribe(
      `peer:signal/${iridium.connector?.peerId}`,
    )
  }

  /**
   * @method requestPeerCalls
   * @description Send an iridium message requesting for the given peerIds to initiate a call
   */
  async requestPeerCalls(force = false) {
    await Promise.all(
      this.peerDetails.map(async ({ id: peerId }) => {
        if (peerId === iridium.connector?.peerId) {
          return
        }
        if (this.isCallee[peerId]) {
          return
        }

        console.log('this.isCaller[peer.id]', this.isCaller[peerId])

        this.isCaller[peerId] = true
        if (!this.peers[peerId]) {
          console.log('initiateCall', peerId, this.isCaller[peerId])
          await this.initiateCall(peerId, this.isCaller[peerId])
        }
        console.log('sendPeerCallRequest', peerId, force)
        await this.sendPeerCallRequest(peerId, force)
      }),
    )
  }

  /**
   * @method start
   * @description It's used for initiate a call
   * @param stream MediaStream object containing the audio/video tracks
   */
  async start() {
    console.log('start')
    if (!this.active) {
      clearInterval(this.peerPollingInterval)
      this.peerPollingInterval = setInterval(async () => {
        if (!this.active) return
        await this.requestPeerCalls()
      }, this.peerPollingFrequency)
      this.active = true
    }

    console.log('requestPeerCalls', this, this.peerDetails)
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
          this.streams[iridium.connector?.peerId]?.audio,
          this.streams[iridium.connector?.peerId]?.video,
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

    console.log('sendPeerCallRequest', this.callId, peerId)
    await iridium.connector?.send(
      {
        module: 'webrtc',
        type: 'peer:call',
        payload: {
          callId:
            this.callId === peerId ? iridium.connector?.peerId : this.callId,
          peers: this.peerDetails,
          peerId,
          signal: this.peerSignals[peerId],
        },
        at: Date.now().valueOf(),
      },
      { to: [peerId] },
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
    if (!this.streams[iridium.connector?.peerId]) {
      this.streams[iridium.connector?.peerId] = {}
    }
    if (!this.tracks[iridium.connector?.peerId]) {
      this.tracks[iridium.connector?.peerId] = new Set()
    }

    const audioTrack = audioStream.getAudioTracks()[0]

    this.streams[iridium.connector?.peerId].audio = audioStream
    this.tracks[iridium.connector?.peerId].add(audioTrack)

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
    if (!this.streams[iridium.connector?.peerId]) {
      this.streams[iridium.connector?.peerId] = {}
    }
    if (!this.tracks[iridium.connector?.peerId]) {
      this.tracks[iridium.connector?.peerId] = new Set()
    }

    const videoTrack = videoStream.getVideoTracks()[0]

    this.streams[iridium.connector?.peerId].video = videoStream
    this.tracks[iridium.connector?.peerId].add(videoTrack)

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

    if (!this.streams[iridium.connector?.peerId]) {
      this.streams[iridium.connector?.peerId] = {}
    }
    if (!this.tracks[iridium.connector?.peerId]) {
      this.tracks[iridium.connector?.peerId] = new Set()
    }

    const screenTrack = screenStream.getVideoTracks()[0]
    screenTrack.enabled = true

    this.screenStreams[iridium.connector?.peerId] = screenStream.id
    this.streams[iridium.connector?.peerId].screen = screenStream
    this.tracks[iridium.connector?.peerId].add(screenTrack)

    this.emit('LOCAL_TRACK_CREATED', {
      track: screenTrack,
      kind: 'screen',
      stream: screenStream,
    })

    await Promise.all(
      Object.values(this.peers).map(async (peer) => {
        await iridium.connector?.send(
          {
            type: 'peer:screenshare',
            payload: {
              streamId: screenStream.id,
              trackId: screenTrack.id,
            },
            sentAt: Date.now().valueOf(),
          },
          { to: peer.id },
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

    if (this.streams[iridium.connector?.peerId].screen) {
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
    return this.tracks[iridium.connector?.peerId]
  }

  /**
   * @method getRemoteTracks
   * @description Extract the remote tracks from the remote stream
   * @returns the remote tracks from the media stream
   */
  getRemoteTracks() {
    return Object.keys(this.tracks)
      .filter((peerId) => peerId !== iridium.connector?.peerId)
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
      .filter((peerId) => peerId !== iridium.connector?.peerId)
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
      .filter((peerId) => peerId !== iridium.connector?.peerId)
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
    return this.streams[iridium.connector?.peerId]
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
    return this.streams[iridium.connector?.peerId]?.[kind]
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
    return (
      Object.entries(this.streams[iridium.connector?.peerId] || {}).length > 0
    )
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
        await iridium.connector?.send(
          {
            type: 'peer:hangup',
            payload: { peerId: iridium.connector?.peerId, callId: this.callId },
            sentAt: Date.now().valueOf(),
          },
          { to: peer.id },
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
      peerId: iridium.connector?.peerId,
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
    if (andEmit) {
      this.emit('DESTROY', {
        callId: this.callId,
        peerId: iridium.connector?.peerId,
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
    peerId = iridium.connector?.peerId,
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
      track.stop()
      stream.removeTrack(track)
    }

    // tell all of the peers that we muted the track
    if (peerId === iridium.connector?.peerId) {
      await Promise.all(
        Object.values(this.peers).map(async (peer) => {
          await iridium.connector?.send(
            {
              type: 'peer:mute',
              payload: {
                callId:
                  this.callId === peer.id
                    ? iridium.connector?.peerId
                    : this.callId,
                trackId: track.id,
                kind,
              },
              at: Date.now().valueOf(),
            },
            { to: peer.id },
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
    peerId = iridium.connector?.peerId,
  }: {
    kind: string
    peerId?: string
  }) {
    if (peerId === iridium.connector?.peerId) {
      if (kind === 'audio' && !this.streams[peerId]?.audio) {
        await this.createAudioStream(true)
      } else if (
        kind === 'video' &&
        !this.streams[peerId]?.video?.getVideoTracks()?.length
      ) {
        await this.createVideoStream(true)
      } else if (kind === 'screen' && !this.streams[peerId]?.screen) {
        await this.createDisplayStream()
      }
    }

    const stream = this.streams[peerId]?.[kind]
    if (!stream) {
      return
    }

    const track: MediaStreamTrack =
      kind === 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0]
    track.enabled = true

    if (peerId !== iridium.connector?.peerId) {
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
        await iridium.connector?.send(
          {
            type: 'peer:unmute',
            payload: {
              callId:
                this.callId === peer.id
                  ? iridium.connector?.peerId
                  : this.callId,
              trackId: track.id,
              kind,
            },
            sentAt: Date.now().valueOf(),
          },
          { to: peer.id },
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
  protected async _bindBusListeners() {
    console.log('_bindBusListeners')
    await Promise.all([
      iridium.connector?.on(
        `peer:signal/${iridium.connector?.peerId}`,
        this._onBusSignal.bind(this),
      ),
      iridium.connector?.on('peer:signal', this._onBusSignal.bind(this)),
      iridium.connector?.on('peer:refuse', this._onBusRefuse.bind(this)),
      iridium.connector?.on('peer:hangup', this._onBusHangup.bind(this)),
      iridium.connector?.on(
        'peer:screenshare',
        this._onBusScreenshare.bind(this),
      ),
      iridium.connector?.on('peer:mute', this._onBusMute.bind(this)),
      iridium.connector?.on('peer:unmute', this._onBusUnmute.bind(this)),
      iridium.connector?.on('peer:destroy', this._onBusDestroy.bind(this)),
    ])
  }

  /**
   * @method _unbindBusListeners
   * @description Internal function to unbind listeners to the communiciationBus events
   * @example
   * this._unbindBusListeners();
   */
  protected async _unbindBusListeners() {
    await Promise.all([
      iridium.connector?.off('peer:signal', this._onBusSignal),
      iridium.connector?.off('peer:refuse', this._onBusRefuse),
      iridium.connector?.off('peer:hangup', this._onBusHangup),
      iridium.connector?.off('peer:screenshare', this._onBusScreenshare),
      iridium.connector?.off('peer:mute', this._onBusMute),
      iridium.connector?.off('peer:unmute', this._onBusUnmute),
      iridium.connector?.off('peer:destroy', this._onBusDestroy),
    ])
  }

  /**
   * @method _bindPeerListeners
   * @description Internal function to bind listeners to the main peer events
   * @example
   * this._bindPeerListeners()
   */
  protected _bindPeerListeners(peer: CallPeer) {
    console.log('_bindPeerListeners')
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
  protected _onSignal(peer: CallPeer, data: Peer.SignalData) {
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

    console.log('_sendSignal', peer.id)
    await iridium.connector?.broadcast(`peer:signal/${peer.id}`, {
      type: 'peer:signal',
      peerId: iridium.connector?.peerId,
      callId: this.callId === peer.id ? iridium.connector?.peerId : this.callId,
      data,
      at: Date.now().valueOf(),
    })
    // await iridium.connector.send(
    //   {
    //     type: 'peer:signal',
    //     payload: {
    //       callId:
    //         this.callId === peer.id ? iridium.connector?.peerId : this.callId,
    //       data,
    //     },
    //     at: Date.now().valueOf(),
    //   },
    //   { to: [peer.id] },
    // )
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
      await peer.send({ peerId: iridium.connector?.peerId, type, ...data })
    })
    // await Promise.all(
    //   Object.values(this.peers).map(async (peer) => {
    //     await peer.send({ peerId: iridium.connector?.peerId, type, ...data })
    //   }),
    // )
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
    if (!this.screenStreams[iridium.connector?.peerId]) {
      return
    }

    // tell the peer to start screen sharing
    const screenStream = this.streams[iridium.connector?.peerId]?.screen
    const screenTrack = screenStream?.getVideoTracks()[0]
    await iridium.connector?.send(
      {
        type: 'peer:screenshare',
        payload: {
          streamId: screenStream.id,
          trackId: screenTrack.id,
        },
        sentAt: Date.now().valueOf(),
      },
      { to: peer.id },
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
    this.destroyPeer(peer.id)
    delete this.peers[peer.id]
  }

  /**
   * @method _onBusSignal
   * @description Callback for the on signal event
   * @param message Message containing the signal data
   */
  protected async _onBusSignal({
    payload,
  }: {
    payload: { peerId: string; callId: string; data: any }
  }) {
    console.log('_onBusSignal', payload.peerId)
    console.log('_onBusSignal', payload.callId)
    console.log('_onBusSignal', payload.data)
    this.peerSignals[payload.peerId] = payload.data
    if (
      payload.data?.type === 'candidate' &&
      !this.isCallee[payload.peerId] &&
      !this.isCaller[payload.peerId] &&
      !this.active
    ) {
      this.emit('INCOMING_CALL', {
        peerId: payload.peerId,
        callId: this.callId,
      })
    }

    const peer = this.peers[payload.peerId]
    if (!peer) {
      return
    }

    this.peerConnected[payload.peerId] = true
    await peer.signal(payload.data)
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
    const peer = this.peers[peerId]
    if (peer) {
      peer.destroy()
    }

    if (this.streams[peerId]) {
      Object.values(this.streams[peerId]).forEach((stream) => {
        stream.getTracks().forEach((track) => {
          track.stop()
        })
      })
      delete this.streams[peerId]
    }

    delete this.peers[peerId]
    delete this.peerConnected[peerId]
    delete this.peerSignals[peerId]
    delete this.isCaller[peerId]
    delete this.isCallee[peerId]

    this.peerDetails = this.peerDetails.filter((peer) => peer.id !== peerId)

    if (
      Object.values(this.peers).filter(
        (p) => p.id !== iridium.connector?.peerId,
      ).length === 0
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
