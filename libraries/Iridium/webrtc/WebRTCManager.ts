import { didUtils, Emitter, IridiumPubsubMessage } from '@satellite-im/iridium'
import { IridiumDecodedPayload } from '@satellite-im/iridium/src/core/encoding'
import { SignalData } from 'simple-peer'
import iridium from '../IridiumManager'
import {
  WebRTCState,
  WebRTCStreamConstraints,
} from '~/libraries/Iridium/webrtc/types'
import { Call, CallPeerDescriptor } from '~/libraries/WebRTC/Call'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'
import { TrackKind } from '~/libraries/WebRTC/types'
import logger from '~/plugins/local/logger'
import { WebRTCEnum } from '~/libraries/Enums/enums'
import { User } from '~/libraries/Iridium/users/types'
import { Conversation } from '~/libraries/Iridium/chat/types'
import Peer from '~/libraries/WebRTC/Peer'
import { Config } from '~/config'
import { Wire } from '~/libraries/WebRTC/Wire'

const $Sounds = new SoundManager()

const announceFrequency = 60000

const initialState: WebRTCState = {
  incomingCall: null,
  activeCall: null,
  streamMuted: {},
  callTime: 0,
  callStartedAt: 0,
  streamConstraints: {
    audio: true,
    video: true,
  },
  calls: {},
}

type WebRTCAnnounceMessage = {
  type: 'announce'
  status?: 'online' | 'offline'
}
type WebRTCCallMessage = {
  type: 'call'
  callId: string
  peers: CallPeerDescriptor[]
}
type WebRTCTypingMessage = {
  type: 'typing'
  conversationId: string
}
type WebRTCSignalMessage = {
  type: 'signal'
  conversationId: string
}

export default class WebRTCManager extends Emitter {
  public state: WebRTCState
  private loggerTag = 'iridium/webRTC'
  public timers: { [key: string]: any } = {}

  constructor() {
    super()
    this.state = initialState
    this.wire = new Wire()
  }

  set streamConstraints(constraints: MediaStreamConstraints) {
    this.state.streamConstraints = {
      ...this.state.streamConstraints,
      ...constraints,
    } as WebRTCStreamConstraints
  }

  get streamConstraints() {
    return this.state.streamConstraints
  }

  async init() {
    if (!iridium.connector || !iridium.connector.p2p.primaryNodeID) {
      throw new Error('not connected to primary node')
    }
    logger.info(
      'iridium/webrtcmanager/init',
      'p2p ready, initializing webrtc...',
    )

    // Subscribe to wire messages
    // this.wire?.on('bus:message', (type, message) => {
    //   console.log('MANUEL bus message', type, message)
    // })

    // Initialize the Wire
    this.wire.init()

    await this.wire.setupAnnounce()

    // ask the sync node to subscribe to this topic
    // await iridium.connector.subscribe('/webrtc/announce', {
    //   handler: this.onMessage.bind(this),
    //   sync: true,
    // })
    // await this.setupAnnounce()

    setInterval(() => {
      if (this.state.activeCall) {
        this.state.callTime = Date.now() - this.state.callStartedAt
      }
    }, 1000)
  }

  private async setupAnnounce() {
    await new Promise((resolve) =>
      setTimeout(() => this.announce().then(() => resolve(true)), 5000),
    )
    setInterval(this.announce.bind(this), announceFrequency)
  }

  async announce() {
    if (!iridium.connector) return
    const profile = iridium.profile.state
    const friends = iridium.friends.state.friends
    if (!profile || !friends) return
    logger.debug(this.loggerTag, 'announce', {
      friends,
    })

    if (
      !friends ||
      !friends.length ||
      !(profile.name && iridium.connector.p2p.ready)
    )
      return

    try {
      await iridium.connector?.publish(
        '/webrtc/announce',
        {
          type: 'announce',
        },
        {
          encrypt: {
            recipients: friends.filter(
              (friend) =>
                this.rtcConnections[friend]?.connected &&
                !this.isTrying[friend],
            ),
          },
        },
      )
    } catch (e) {
      const error = e as Error
      logger.error(this.loggerTag, 'announce failed to publish', error)
    }
  }

  private async onMessage({
    from,
    payload,
  }: IridiumPubsubMessage<
    IridiumDecodedPayload<
      | WebRTCCallMessage
      | WebRTCAnnounceMessage
      | WebRTCTypingMessage
      | WebRTCSignalMessage
    >
  >) {
    const { type } = payload.body
    const did = didUtils.didString(from)
    switch (type) {
      case 'call':
        await this.onPeerCall(did, payload.body as WebRTCCallMessage)
        break
      case 'typing':
        await this.onPeerTyping(did, payload.body as WebRTCTypingMessage)
        break
      case 'announce':
        await this.onPeerAnnounce(did, payload.body as WebRTCAnnounceMessage)
        break
    }
  }

  private async onPeerCall(from: string, payload: WebRTCCallMessage) {
    const { callId, peers } = payload
    const loggerPrefix = 'iridium/webrtc/message/call'

    if (!callId) {
      logger.error(loggerPrefix, `invalid callId`, {
        from,
        payload,
      })
      return
    }

    logger.log(loggerPrefix, `incoming call`, {
      from,
      callId,
      peers,
    })

    const call = this.state.calls[callId]
    if (!call) {
      logger.info(loggerPrefix, `call not found, creating...`, {
        from,
        callId,
        peers,
      })
      await this.createCall({
        did: from,
        callId,
        peers,
      })
      return
    }

    if (this.state.activeCall?.callId !== call.callId) {
      logger.log(loggerPrefix, `No active call with call id: ${call.callId}`)
      return
    }

    if (!call.peerConnected[from] && !call.peerDialingDisabled[from]) {
      logger.log(loggerPrefix, `initiate a call...`)
      await call.initiateCall(from)
      this.state.callStartedAt = Date.now()
    }
  }

  private onPeerTyping(from: string, message: WebRTCTypingMessage) {
    const { conversationId } = message
    const conversation = iridium.chat.getConversation(message.conversationId)
    logger.info(this.loggerTag, 'onPeerTyping', { from, conversationId })
    if (!from || !conversation || !conversation.participants.includes(from))
      return

    iridium.chat.setTyping(conversationId, from, true)
    clearTimeout(this.timers[`${conversationId}/typing`])
    this.timers[`${conversationId}/typing`] = setTimeout(() => {
      iridium.chat.setTyping(conversationId, from, false)
    }, 5000)
  }

  private onPeerAnnounce(from: string, payload: WebRTCAnnounceMessage) {
    const requestFriend = iridium.users.getUser(from)
    if (!requestFriend) return

    iridium.users.setUserStatus(requestFriend.did, payload.status || 'online')

    // const peer = new Peer('', requestFriend.did, {
    //   initiator: true,
    //   config: { iceServers: Config.webrtc.iceServers },
    // })

    // this.rtcConnections[requestFriend.did] = peer

    if (payload.status === 'offline') {
      Object.values(this.state.calls).forEach((call) => {
        if (call.peers[from]) {
          call.destroyPeer(from)
          delete call.peers[from]
        }
      })
    }
  }

  // protected _bindPeerListeners(peer: CallPeer) {
  //   peer.on('signal', this._onSignal.bind(this, peer))
  //   peer.on('connect', this._onConnect.bind(this, peer))
  //   peer.on('error', this._onError.bind(this, peer))
  //   peer.on('close', this._onClose.bind(this, peer))
  // }

  // protected _unbindPeerListeners(peer: CallPeer) {
  //   peer.off('signal', this._onSignal)
  //   peer.off('connect', this._onConnect)
  //   peer.off('error', this._onError)
  //   peer.off('close', this._onClose)
  // }

  // todo - refactor to accept multiple recipients for group calls
  public async call({
    recipient,
    conversationId,
    kinds,
  }: {
    recipient: User['did']
    conversationId: Conversation['id']
    kinds: TrackKind[]
  }) {
    if (!iridium.id) {
      logger.error('webrtc', 'call - connector.id not found')
      return
    }

    if (!iridium.chat?.hasConversation(conversationId)) {
      return
    }

    const conversation = iridium.chat?.getConversation(conversationId)

    if (!conversation) {
      return
    }

    const { id: callId, participants } = conversation

    if (!callId) {
      logger.log(
        'webrtc',
        `call - conversation not initialized or id not found`,
      )
      return
    }

    if (participants.length === 0) {
      logger.log('webrtc', `call - conversation has no participants`)
      return
    }

    if (!this.state.calls[callId]) {
      logger.log('webrtc', `call - call not found: ${callId}, creating...`)

      const peers = participants.map((did) => {
        const user =
          iridium.users.getUser(did) ||
          (iridium.profile.state ?? {
            did,
            name: did,
          })

        return {
          name: user.name,
          id: did,
        }
      })

      this.createCall({
        callId,
        peers,
        did: recipient,
      })
    }

    const call = this.state.calls[callId]

    if (!call) {
      logger.log('webrtc', `call - call not ready: ${callId}`)
      return
    }

    this.setStreamMuted(iridium.id, {
      audio: !kinds.includes('audio'),
      video: !kinds.includes('video'),
      screen: !kinds.includes('screen'),
    })

    this.state.callStartedAt = Date.now()
    const constraints = this.streamConstraints
    await call.createLocalTracks(kinds, constraints)

    this.state.incomingCall = null
    this.state.activeCall = {
      callId,
      did: iridium.id,
    }

    await call.start()
  }

  setStreamMuted(
    did: string,
    {
      audio,
      video,
      screen,
      headphones,
    }: {
      audio?: boolean
      video?: boolean
      screen?: boolean
      headphones?: boolean
    } = {},
  ) {
    this.state.streamMuted = {
      ...this.state.streamMuted,
      [did]: {
        audio: audio ?? this.state.streamMuted[did]?.audio ?? false,
        video: video ?? this.state.streamMuted[did]?.video ?? false,
        screen: screen ?? this.state.streamMuted[did]?.screen ?? false,
        headphones:
          headphones ?? this.state.streamMuted[did]?.headphones ?? false,
      },
    }

    this.emit('streamMuted', { did, ...this.state.streamMuted[did] })
  }

  private createCall({
    callId,
    peers,
    did,
  }: {
    callId: string
    peers: CallPeerDescriptor[]
    did?: string
  }) {
    logger.log('webrtc: creating call', callId + peers)

    if (!iridium.id) {
      logger.error('webrtc', 'call - connector.id not found')
      return
    }

    const usedCallId = callId === iridium.id ? did : callId

    if (!usedCallId) {
      throw new Error('webrtc: invalid callId provided: ' + callId)
    }

    const call = this.state.calls[callId] || new Call(callId, peers)
    this.state.calls = { ...this.state.calls, [callId]: call }

    this.setStreamMuted(iridium.id, {
      audio: true,
      video: true,
      screen: true,
    })
    if (did) {
      this.setStreamMuted(did, {
        audio: true,
        video: true,
        screen: true,
      })
    } else {
      peers.forEach((peer) => {
        this.setStreamMuted(peer.id, {
          audio: true,
          video: true,
          screen: true,
        })
      })
    }

    if (!call) {
      logger.log('webrtc/createCall', 'call invalid')
      return
    }

    const onCallIncoming = async ({
      did,
      data,
    }: {
      did: string
      data: SignalData
    }) => {
      logger.debug('webrtc/createCall', 'onCallIncoming', { did, data })
      call.peerDialingDisabled[did] = true
      if (this.state.activeCall?.callId === call.callId) {
        call.answer(did, data)
      }
      if (this.state.activeCall?.callId) {
        return
      }
      if (
        this.state.incomingCall === null &&
        (!call.active || this.state.activeCall?.callId !== call.callId)
      ) {
        const type = 'friend'
        logger.log(
          'webrtc/incomingCall',
          `incoming call #${call.callId} (${type})`,
        )

        this.state.incomingCall = {
          callId: call.callId,
          did,
          type,
          data,
        }
      }
      $Sounds.playSound(Sounds.CALL)
    }
    call.on('INCOMING_CALL', onCallIncoming)

    const onCallOutgoing = async ({ did }: { did: string }) => {
      this.state.incomingCall = null
      this.state.activeCall = {
        callId,
        did,
      }
      $Sounds.playSound(Sounds.CALL)
    }
    call.on('OUTGOING_CALL', onCallOutgoing)

    const onCallConnected = async ({ did }: { did: string }) => {
      this.state.incomingCall = null
      this.state.activeCall = { callId, did }
      this.state.callStartedAt = Date.now()

      // TODO: wire this up to mute
      this.emit('callConnected', { callId, did })

      $Sounds.stopSounds([Sounds.CALL])
      $Sounds.playSound(Sounds.CONNECTED)
    }
    call.on('CONNECTED', onCallConnected)

    const onCallHangup = async () => {
      this.state.incomingCall = null
      this.state.activeCall = null
      this.state.callStartedAt = 0
    }
    call.on('HANG_UP', onCallHangup)

    const onCallTrack = async ({
      track,
      kind,
    }: {
      track: MediaStreamTrack
      stream: MediaStream
      kind?: string
    }) => {
      logger.log('webrtc', `local track created: ${track.kind}#${track.id}`)

      if (!kind) return

      if (!iridium.id) {
        logger.error('webrtc', 'onCallTrack - connector.id not found')
        return
      }

      // emit the track event so that the UI can display/mute the track
      this.emit('track', {
        did: iridium.id,
        kind,
      })
    }
    call.on('LOCAL_TRACK_CREATED', onCallTrack)

    const onLocalTrackUnmuted = async ({
      track,
      kind,
    }: {
      track: MediaStreamTrack
      stream: MediaStream
      kind?: string | undefined
    }) => {
      logger.log('webrtc', `local track unmuted: ${track.kind}#${track.id}`)
      if (!kind) return

      if (!iridium.id) {
        logger.error('webrtc', 'onCallTrack - connector.id not found')
        return
      }

      this.setStreamMuted(iridium.id, { [kind]: false })
    }
    call.on('LOCAL_TRACK_UNMUTED', onLocalTrackUnmuted)

    const onCallPeerTrack = async ({
      track,
      did,
      kind,
    }: {
      track: MediaStreamTrack
      did: string
      kind?: string
    }) => {
      logger.log(
        'webrtc',
        `remote track received: ${track.kind}#${track.id} from ${did} ${track.enabled}`,
      )

      if (!kind) return

      this.setStreamMuted(did, { [kind]: !track.enabled })
    }
    call.on('REMOTE_TRACK_RECEIVED', onCallPeerTrack)

    const onPeerTrackUnmuted = async ({
      did,
      trackId,
      kind,
    }: {
      did: string
      trackId: string
      kind?: string
    }) => {
      logger.log(
        'webrtc',
        `remote track unmuted: ${trackId} from ${did} ${kind}`,
      )
      if (!kind) return

      this.setStreamMuted(did, { [kind]: false })
    }
    call.on('REMOTE_TRACK_UNMUTED', onPeerTrackUnmuted)

    const onRemoteTrackMuted = async ({
      did,
      trackId,
      kind,
    }: {
      did: string
      trackId: string
      kind?: string
    }) => {
      if (!kind) return

      logger.log('webrtc', `remote track muted: #${trackId} from ${did}`)

      this.setStreamMuted(did, { [kind]: true })
    }
    call.on('REMOTE_TRACK_MUTED', onRemoteTrackMuted)

    const onLocalTrackRemoved = async ({
      track,
      kind,
    }: {
      track: MediaStreamTrack
      kind?: string
    }) => {
      if (!kind) return

      logger.log('webrtc', `local track removed: ${kind}#${track.id}`)

      if (!iridium.id) {
        logger.error('webrtc', 'onLocalTrackRemoved - connector.id not found')
        return
      }

      this.setStreamMuted(iridium.id, { [kind]: true })
    }
    call.on('LOCAL_TRACK_REMOVED', onLocalTrackRemoved)

    const onStream = async ({ did, kind }: { did: string; kind?: string }) => {}
    call.on('STREAM', onStream)

    const onAnswered = async ({ did }: { did: string }) => {
      this.state.incomingCall = null
      this.state.activeCall = { callId, did }
    }
    call.on('ANSWERED', onAnswered)

    const onCallDestroy = async () => {
      this.state.incomingCall = null
      this.state.activeCall = null
      this.state.callStartedAt = 0

      call.off('INCOMING_CALL', onCallIncoming)
      call.off('OUTGOING_CALL', onCallOutgoing)
      call.off('CONNECTED', onCallConnected)
      call.off('HANG_UP', onCallHangup)
      call.off('LOCAL_TRACK_CREATED', onCallTrack)
      call.off('REMOTE_TRACK_RECEIVED', onCallPeerTrack)
      call.off('REMOTE_TRACK_UNMUTED', onPeerTrackUnmuted)
      call.off('REMOTE_TRACK_MUTED', onRemoteTrackMuted)
      call.off('LOCAL_TRACK_UNMUTED', onLocalTrackUnmuted)
      call.off('LOCAL_TRACK_REMOVED', onLocalTrackRemoved)
      call.off('STREAM', onStream)
      call.off('ANSWERED', onAnswered)
      call.off('DESTROY', onCallDestroy)
      call.off('ERROR', onCallDestroy)

      // Destroy call
      call.destroy(true, false)
      delete this.state.calls[callId]

      $Sounds.stopSounds([Sounds.CALL])
      $Sounds.playSound(Sounds.HANGUP)
    }
    call.on('DESTROY', onCallDestroy)
    call.on('ERROR', onCallDestroy)

    this.emit('callCreated', {})
  }

  public async acceptCall(kinds: TrackKind[]) {
    if (!iridium.id) {
      logger.error('webrtc', 'acceptCall - connector.id not found')
      return
    }

    if (!this.state.incomingCall) {
      logger.error('webrtc', 'acceptCall - no incoming call to accept')
      return
    }

    const { callId, did, data } = this.state.incomingCall

    const call = this.state.calls[callId]

    if (!call) {
      return
    }

    const constraints = this.streamConstraints
    await call.createLocalTracks(kinds, constraints)
    await call.answer(did, data)
  }

  public denyCall() {
    if (this.state.activeCall) {
      this.state.calls[this.state.activeCall.callId]?.destroy()
    }

    if (this.state.incomingCall) {
      this.state.calls[this.state.incomingCall.callId]?.destroy()
    }
  }

  public async hangUp() {
    if (this.state.activeCall) {
      this.state.calls[this.state.activeCall.callId]?.destroy()
    }
    this.state.incomingCall = null
    this.state.activeCall = null
  }

  public async toggleMute({ did, kind }: { did: string; kind: WebRTCEnum }) {
    if (!this.state.activeCall || !did) {
      return
    }
    const call = this.state.calls[this.state.activeCall.callId]
    if (!call) {
      return
    }
    const isMuted = this.state.streamMuted[did]?.[kind]
    if (isMuted) {
      const constraints = this.streamConstraints
      await call.unmute({ did, kind, constraints })
      $Sounds.playSound(Sounds.UNMUTE)
      return
    }
    await call.mute({ did, kind })
    $Sounds.playSound(Sounds.MUTE)
  }

  /**
   * @method sendTyping
   * @description - send the TYPING event to the other conversation participants
   */
  public async sendTyping(conversationId: string) {
    const conversation = iridium.chat.getConversation(conversationId)

    if (!conversation) return

    // broadcast the message to connected peers
    await iridium.connector?.publish(
      '/webrtc/announce',
      {
        type: 'typing',
        did: iridium.id,
        conversationId,
        at: Date.now().valueOf(),
      },
      {
        encrypt: { recipients: conversation.participants },
      },
    )
  }

  // WILL BE REPLACED ONCE DIRECT SEND WITH IRIDIUM WORKS
  public sendWebrtc(did: string, payload: any) {
    return iridium.connector?.publish('/webrtc/announce', payload, {
      encrypt: { recipients: [did] },
    })
  }

  public isBackgroundCall(callId?: string) {
    if (!this.state.activeCall?.callId) {
      return false
    }
    return this.state.activeCall.callId !== callId
  }

  public isActiveCall(callId?: string) {
    if (!iridium.webRTC.state.activeCall?.callId || !callId) {
      return false
    }
    return iridium.webRTC.state.activeCall.callId === callId
  }

  public localParticipant(): User | undefined {
    const id = this.state.activeCall?.did
    if (!id) {
      return
    }
    return { ...iridium.profile.state } as User
  }

  public remoteParticipants(): User[] {
    const id = this.state.activeCall?.callId

    if (!id || !iridium.chat.hasConversation(id)) {
      return []
    }

    const conversation = iridium.chat.getConversation(id)

    const dids =
      conversation?.participants?.filter((f) => f !== iridium.id) || []

    return dids.map((did) => ({ ...iridium.users.getUser(did) } as User))
  }

  public async mute({
    kind = 'audio',
    did = iridium.id,
  }: {
    kind: string
    did?: string
  }) {
    if (!this.state.activeCall) return
    const call = this.state.calls[this.state.activeCall.callId]
    if (!call) return
    await call.mute({ kind, did })
  }

  public async unmute({
    kind,
    did = iridium.id,
  }: {
    kind: string
    did?: string
  }) {
    if (!this.state.activeCall) return
    const call = this.state.calls[this.state.activeCall.callId]
    if (!call) return
    await call.unmute({ did, kind, constraints: this.streamConstraints })
  }
}
