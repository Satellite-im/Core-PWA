import Vue from 'vue'
import { Emitter, IridiumPubsubMessage } from '@satellite-im/iridium'
import type { SyncSubscriptionResponse } from '@satellite-im/iridium/src/sync/agent'
import { SignalData } from 'simple-peer'
import iridium, { IridiumManager } from '../IridiumManager'
import { WebRTCState } from '~/libraries/Iridium/webrtc/types'
import { CallPeerDescriptor } from '~/libraries/WebRTC/Call'
import { Friend } from '~/libraries/Iridium/friends/types'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'
import { TrackKind } from '~/libraries/WebRTC/types'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import logger from '~/plugins/local/logger'
import { Config } from '~/config'

const $Sounds = new SoundManager()

const initialState: WebRTCState = {
  incomingCall: null,
  activeCall: null,
  streamMuted: {},
  createdAt: 0,
}

export default class WebRTCManager extends Emitter {
  public readonly iridium: IridiumManager
  public state: WebRTCState
  private loggerTag = 'iridium/webRTC'
  public timeoutMap: { [key: string]: ReturnType<typeof setTimeout> } = {}
  private userStatusMap: { [key: string]: ReturnType<typeof setTimeout> } = {}

  private _subscriptions: {
    [key: string]: { topic: string; connected: boolean; handler?: Function }
  } = {}

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
    this.state = initialState
  }

  async init() {
    await this.fetch()
    // this.setupListeners()
    await this.subscribeToAnnounce()

    this.iridium.connector?.p2p.on<
      IridiumPubsubMessage<SyncSubscriptionResponse>
    >('node/message/sync/subscribe', this.onSyncSubscriptionResponse.bind(this))

    this.iridium.connector?.p2p.on('ready', async () => {
      if (!this.iridium.connector?.p2p.primaryNodeID) {
        throw new Error('not connected to primary node')
      }
      logger.info(
        'iridium/webrtcmanager/init',
        'p2p ready, initializing webrtc...',
      )

      const channels = [
        {
          topic: 'webrtc',
          handler: this.onMessage,
        },
      ]

      channels.forEach(async ({ topic, handler }) => {
        if (this._subscriptions[topic] !== undefined) return

        this._subscriptions[topic] = { topic, handler, connected: false }
        logger.info(
          'iridium/webrtcmanager/init',
          `requesting sync subscription to ${topic}`,
        )
        // ask the sync node to subscribe to this topic
        await this.iridium.connector?.p2p.send(
          this.iridium.connector?.p2p.primaryNodeID,
          {
            type: 'sync/subscribe',
            topic,
          },
        )
      })
    })
  }

  /**
   * @param message - pubsub message from the sync node
   * @description - handle a sync subscription response from the sync node
   */
  async onSyncSubscriptionResponse(
    message: IridiumPubsubMessage<SyncSubscriptionResponse>,
  ) {
    logger.info(
      'iridium/webrtcmanager/onSyncSubscriptionResponse',
      'message received from sync node',
      message,
    )
    if (!message.payload.body.topic) {
      throw new Error('no topic in sync subscription response')
    }
    const [channel, subscription] =
      Object.entries(this._subscriptions).find(
        ([, { topic }]) => topic === message.payload.body.topic,
      ) || []

    if (!channel || !subscription) {
      return
    }
    if (subscription?.connected) {
      throw new Error('subscription already connected')
    }
    if (message.payload.body.success) {
      logger.info(
        'iridium/webrtcmanager/onSyncSubscriptionResponse',
        `sync node subscribed to ${message.payload.body.topic}`,
      )
      await this.iridium.connector?.subscribe(
        message.payload.body.topic,
        subscription.handler
          ? { handler: subscription.handler.bind(this) }
          : null,
      )
      subscription.connected = true
      return
    }
    logger.warn(
      'iridium/chatmanager/onSyncSubscriptionResponse',
      'sync node failed to subscribe',
      message,
    )
  }

  async fetch() {
    this.state = {
      ...this.state,
      ...(await this.get('/')),
    }
    return this.state
  }

  get(path: string = '', options: any = {}) {
    return this.iridium.connector?.get(`/webRTC${path}`, options)
  }

  set(path: string = '', payload: any, options: any = {}) {
    logger.info(this.loggerTag, 'path, paylaod and state', {
      path,
      payload,
      state: this.state,
    })
    return this.iridium.connector?.set(
      `/webRTC${path === '/' ? '' : path}`,
      payload,
      options,
    )
  }

  // NOT WORKING RN
  // private setupListeners() {
  //   this.iridium.connector?.on('peer:discovery', ({ did }: { did: string }) => {
  //     const loggerPrefix = 'webrtc/peer:discovery - '
  //     if (!did) return

  //     const id = this.iridium.chat?.directConversationIdFromDid(did)

  //     if (id && this.iridium.chat?.hasConversation(id)) {
  //       const conversation = this.iridium.chat?.getConversation(id)
  //       const connectedParticipant = conversation.participants.find(
  //         (participant) => participant === did,
  //       )
  //       if (connectedParticipant) {
  //         logger.log(loggerPrefix, `connected participant: ${did}`)
  //         // this.iridium.chat.updateConversation({
  //         //   ...conversation,
  //         //   participants: conversation.participants.map((participant) => {
  //         //     if (participant.did === connectedParticipant.did) {
  //         //       return {
  //         //         ...participant,
  //         //         status: 'online',
  //         //       }
  //         //     }
  //         //     return participant
  //         //   }),
  //         // })
  //       }
  //     }

  //     const connectedFriend = this.iridium.friends.getFriend(did)

  //     if (!connectedFriend) return

  //     logger.log(loggerPrefix, `discovered peer: ${did}`)

  //     this.iridium.friends.updateFriend({
  //       ...connectedFriend,
  //       status: 'online',
  //     })
  //   })

  //   this.iridium.connector?.p2p.on(
  //     'peer/connect',
  //     ({ did }: { did: string }) => {
  //       const loggerPrefix = 'webrtc/peer:connect - '

  //       if (!did) return
  //       const id = this.iridium.chat?.directConversationIdFromDid(did)

  //       if (id && this.iridium.chat?.hasConversation(id)) {
  //         const conversation = this.iridium.chat?.getConversation(id)
  //         const connectedParticipant = conversation.participants.find(
  //           (participant) => participant === did,
  //         )
  //         if (connectedParticipant) {
  //           logger.log(loggerPrefix, `connected participant: ${did}`)
  //           // this.iridium.chat.updateConversation({
  //           //   ...conversation,
  //           //   participants: conversation.participants.map((participant) => {
  //           //     if (participant.did === connectedParticipant.did) {
  //           //       return {
  //           //         ...participant,
  //           //         status: 'online',
  //           //       }
  //           //     }
  //           //     return participant
  //           //   }),
  //           // })
  //         }
  //       }

  //       const connectedFriend = this.iridium.friends.getFriend(did)

  //       if (!connectedFriend) return

  //       logger.log(loggerPrefix, `connected friend: ${did}`)

  //       this.iridium.friends.updateFriend({
  //         ...connectedFriend,
  //         status: 'online',
  //       })
  //     },
  //   )

  //   this.iridium.connector?.on(
  //     'peer:disconnect',
  //     ({ did }: { did: string }) => {
  //       const loggerPrefix = 'webrtc/peer:disconnect - '

  //       if (!did) return

  //       const id = this.iridium.chat?.directConversationIdFromDid(did)

  //       if (id && this.iridium.chat?.hasConversation(id)) {
  //         const conversation = this.iridium.chat?.getConversation(id)
  //         const disconnectedParticipant = conversation.participants.find(
  //           (participant) => participant === did,
  //         )
  //         if (disconnectedParticipant) {
  //           logger.log(loggerPrefix, `disconnected participant: ${did}`)
  //           // this.iridium.chat.updateConversation({
  //           //   ...conversation,
  //           //   participants: conversation.participants.map((participant) => {
  //           //     if (participant.did === disconnectedParticipant.did) {
  //           //       return {
  //           //         ...participant,
  //           //         status: 'offline',
  //           //       }
  //           //     }
  //           //     return participant
  //           //   }),
  //           // })
  //         }
  //       }

  //       const disconnectedFriend = this.iridium.friends.getFriend(did)

  //       if (!disconnectedFriend) return

  //       logger.log(loggerPrefix, `discovered peer: ${did}`)

  //       this.iridium.friends.updateFriend({
  //         ...disconnectedFriend,
  //         status: 'offline',
  //       })

  //       $WebRTC.calls.forEach((call) => {
  //         if (call.peers[did]) {
  //           call.destroyPeer(did)
  //           delete call.peers[did]
  //         }
  //       })
  //     },
  //   )
  // }

  // LATER WILL BE REMOVED
  private subscribeToAnnounce = async () => {
    window.addEventListener('beforeunload', () => {
      this.sendAnnounce('offline')
    })

    this.sendAnnounce('online')
    setInterval(() => {
      if (!this.iridium.ready) return

      this.sendAnnounce('online')
    }, Config.webrtc.announceFrequency)
  }

  private sendAnnounce = (status: 'online' | 'offline') => {
    const users = Object.values(this.iridium.users.state)

    users.forEach((user) => {
      this.sendWebrtc(user.did, {
        module: 'webrtc',
        type: 'peer:announce',
        status,
        did: this.iridium.connector?.id,
        at: Date.now().valueOf(),
      })
    })
  }

  private onMessage = ({ payload }: { payload: any }) => {
    if (!payload.body.module || payload.body.module !== 'webrtc') {
      return
    }

    const { type } = payload.body

    switch (type) {
      case 'peer:call':
        this.onPeerCall(payload.body)
        break
      case 'peer:typing':
        this.onPeerTyping(payload.body)
        break
      case 'peer:announce':
        this.onPeerAnnounce(payload.body)
        break
    }
  }

  private onPeerCall = async (payload: any) => {
    const { did, callId, peers } = payload

    const loggerPrefix = 'webrtc/peer:call - '
    logger.log(loggerPrefix, `incoming call with callId: ${payload.callId}`)

    if (!callId) {
      logger.log(loggerPrefix, `invalid callId`)
      return
    }

    const call = $WebRTC.getCall(callId)

    if (!call) {
      logger.log(loggerPrefix, `create a call...`)
      await this.createCall({
        did,
        callId,
        peers,
      })
      return
    }

    if (this.state.activeCall?.callId !== call.callId) {
      logger.log(loggerPrefix, `No active call with call id: ${call.callId}`)
      return
    }

    if (!call.peerConnected[did] && !call.peerDialingDisabled[did]) {
      logger.log(loggerPrefix, `initiate a call...`)
      await call.initiateCall(did)
    }
  }

  private onPeerTyping = ({
    did,
    conversationId,
  }: {
    did: string
    conversationId: string
  }) => {
    const conversation = this.iridium.chat.getConversation(conversationId)
    if (!did || !conversation) return

    if (!this.iridium.chat.typingStatus[conversationId]?.[did]) {
      this.iridium.chat.toggleTypingStatus(conversationId, did)
    }
    clearTimeout(this.timeoutMap[did])

    this.timeoutMap[did] = setTimeout(() => {
      this.iridium.chat.toggleTypingStatus(conversationId, did)
    }, Config.chat.typingInputThrottle * 2)
  }

  private onPeerAnnounce = (payload: any) => {
    const did = payload.did as string
    const requestFriend = this.iridium.users.getUser(did)

    if (!requestFriend) return

    this.iridium.users.setUserStatus(requestFriend.did, payload.status)

    if (payload.status === 'offline') {
      $WebRTC.calls.forEach((call) => {
        if (call.peers[did]) {
          call.destroyPeer(did)
          delete call.peers[did]
        }
      })

      return
    }

    clearTimeout(this.userStatusMap[did])

    this.userStatusMap[did] = setTimeout(() => {
      this.iridium.users.setUserStatus(requestFriend.did, 'offline')
    }, Config.webrtc.announceFrequency * 2)
  }

  public async call(recipient: Friend, kinds: TrackKind[]) {
    if (!this.iridium.connector?.id) {
      logger.error('webrtc', 'call - connector.id not found')
      return
    }

    if (!recipient) {
      logger.error('webrtc', 'call - recipent not found')
      return
    }

    const id = iridium.chat?.directConversationIdFromDid(recipient.did)
    if (!id || !this.iridium.chat?.hasConversation(id)) {
      return
    }

    const conversation = this.iridium.chat?.getConversation(id)

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

    if (!$WebRTC.calls.has(callId)) {
      logger.log('webrtc', `call - call not found: ${callId}, creating...`)

      const peers = participants.map((did) => {
        const user =
          this.iridium.users.getUser(did) || (this.iridium.profile.state ?? '')

        return {
          name: user.name,
          id: did,
        }
      })

      await this.createCall({
        callId,
        peers,
        did: recipient.did,
      })
    }

    const call = $WebRTC.getCall(callId)

    if (!call) {
      logger.log('webrtc', `call - call not ready: ${callId}`)
      return
    }

    Vue.set(this.state.streamMuted, this.iridium.connector.id, {
      audio: !kinds.includes('audio'),
      video: !kinds.includes('video'),
      screen: !kinds.includes('screen'),
    })

    const $nuxt = useNuxtApp()
    $nuxt.$store.commit('video/setDisabled', !kinds.includes('video'), {
      root: true,
    })

    await call.createLocalTracks(kinds)

    this.state.incomingCall = null
    this.state.activeCall = {
      callId,
      did: this.iridium.connector.id,
    }

    await call.start()
  }

  private createCall = async ({
    callId,
    peers,
    did,
  }: {
    callId: string
    peers: CallPeerDescriptor[]
    did?: string
  }) => {
    logger.log('webrtc: creating call', callId + peers)

    if (!this.iridium.connector?.id) {
      logger.error('webrtc', 'call - connector.id not found')
      return
    }

    if (!$WebRTC.initialized && this.iridium.connector?.id) {
      $WebRTC.init(this.iridium.connector?.id)
    }

    const usedCallId = callId === this.iridium.connector?.id ? did : callId

    if (!usedCallId) {
      throw new Error('webrtc: invalid callId provided: ' + callId)
    }

    const call = $WebRTC.connect(usedCallId, peers)

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
      const $nuxt = useNuxtApp()

      this.state.incomingCall = null
      this.state.activeCall = { callId, did }
      this.state.createdAt = Date.now()

      if (!$nuxt.$store.state.audio.muted) {
        call.unmute({ did: this.iridium.connector?.id, kind: 'audio' })
      } else {
        call.mute({ did: this.iridium.connector?.id, kind: 'audio' })
      }

      $Sounds.stopSounds([Sounds.CALL])
      $Sounds.playSound(Sounds.CONNECTED)
    }
    call.on('CONNECTED', onCallConnected)

    const onCallHangup = async () => {
      this.state.incomingCall = null
      this.state.activeCall = null
      this.state.createdAt = 0
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

      if (!this.iridium.connector?.id) {
        logger.error('webrtc', 'onCallTrack - connector.id not found')
        return
      }
      const $nuxt = useNuxtApp()

      let muted: Boolean = true
      if (kind === 'audio') {
        muted = $nuxt.$store.state.audio.muted
      } else if (kind === 'video') {
        muted = $nuxt.$store.state.video.disabled
      }

      Vue.set(this.state.streamMuted, this.iridium.connector.id, {
        ...this.state.streamMuted[this.iridium.connector?.id],
        [kind]: muted,
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

      if (!this.iridium.connector?.id) {
        logger.error('webrtc', 'onCallTrack - connector.id not found')
        return
      }

      Vue.set(this.state.streamMuted, this.iridium.connector.id, {
        ...this.state.streamMuted[this.iridium.connector?.id],
        [kind]: false,
      })
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

      Vue.set(this.state.streamMuted, did, {
        ...this.state.streamMuted[did],
        [kind]: false,
      })
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

      Vue.set(this.state.streamMuted, did, {
        ...this.state.streamMuted[did],
        [kind]: true,
      })
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

      if (!this.iridium.connector?.id) {
        logger.error('webrtc', 'onLocalTrackRemoved - connector.id not found')
        return
      }

      Vue.set(this.state.streamMuted, this.iridium.connector.id, {
        ...this.state.streamMuted[this.iridium.connector?.id],
        [kind]: true,
      })
    }
    call.on('LOCAL_TRACK_REMOVED', onLocalTrackRemoved)

    const onStream = async ({ did, kind }: { did: string; kind?: string }) => {
      if (!kind) return

      Vue.set(this.state.streamMuted, did, {
        ...this.state.streamMuted[did],
        [kind]: !!this.state.streamMuted[did]?.[kind],
      })
    }
    call.on('STREAM', onStream)

    const onAnswered = async ({ did }: { did: string }) => {
      this.state.incomingCall = null
      this.state.activeCall = { callId, did }
    }
    call.on('ANSWERED', onAnswered)

    const onCallDestroy = async () => {
      this.state.incomingCall = null
      this.state.activeCall = null
      this.state.createdAt = 0

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
      $WebRTC.destroyCall(call.callId)
      $Sounds.stopSounds([Sounds.CALL])
      $Sounds.playSound(Sounds.HANGUP)
    }
    call.on('DESTROY', onCallDestroy)
    call.on('ERROR', onCallDestroy)
  }

  public acceptCall = async (kinds: TrackKind[]) => {
    if (!this.iridium.connector?.id) {
      logger.error('webrtc', 'acceptCall - connector.id not found')
      return
    }

    if (!this.state.incomingCall) {
      logger.error('webrtc', 'acceptCall - no incoming call to accept')
      return
    }

    Vue.set(this.state.streamMuted, this.iridium.connector.id, {
      audio: !kinds.includes('audio'),
      video: !kinds.includes('video'),
      screen: !kinds.includes('screen'),
    })

    const $nuxt = useNuxtApp()
    $nuxt.$store.commit('video/setDisabled', !kinds.includes('video'), {
      root: true,
    })

    const { callId, did, data } = this.state.incomingCall

    const call = $WebRTC.getCall(callId)

    if (!call) {
      return
    }

    await call.createLocalTracks(kinds)
    await call.answer(did, data)
  }

  public denyCall = () => {
    if (this.state.activeCall)
      $WebRTC.getCall(this.state.activeCall.callId)?.destroy()
    if (this.state.incomingCall) {
      $WebRTC.getCall(this.state.incomingCall.callId)?.destroy()
    }
  }

  public hangUp = async () => {
    if (this.state.activeCall) {
      $WebRTC.getCall(this.state.activeCall.callId)?.destroy()
    }
    this.state.incomingCall = null
    this.state.activeCall = null
  }

  public async toggleMute({
    did,
    kind,
  }: {
    did: string
    kind: 'audio' | 'video' | 'screen'
  }) {
    if (!this.state.activeCall || !did) {
      return
    }
    const call = $WebRTC.getCall(this.state.activeCall.callId)
    if (!call) {
      return
    }
    const isMuted = this.state.streamMuted[did]?.[kind]
    if (isMuted) {
      await call.unmute({ did, kind })
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
  public sendTyping = async (conversationId: string) => {
    const conversation = this.iridium.chat.getConversation(conversationId)

    if (!conversation) return

    // broadcast the message to connected peers
    await this.iridium.connector?.publish(
      'webrtc',
      {
        module: 'webrtc',
        type: 'peer:typing',
        did: this.iridium.connector.id,
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
    return this.iridium.connector?.publish('webrtc', payload, {
      encrypt: { recipients: [did] },
    })
  }
}
