import { Emitter, IridiumPubsubMessage } from '@satellite-im/iridium'
import type { SyncSubscriptionResponse } from '@satellite-im/iridium/src/sync/agent'
import { SignalData } from 'simple-peer'
import Vue from 'vue'
import iridium, { IridiumManager } from '../IridiumManager'
import { WebRTCState } from '~/libraries/Iridium/webrtc/types'
import { CallPeerDescriptor } from '~/libraries/WebRTC/Call'
import { Friend } from '~/libraries/Iridium/friends/types'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'
import { TrackKind } from '~/libraries/WebRTC/types'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import logger from '~/plugins/local/logger'

const $Sounds = new SoundManager()

const announceFrequency = 5000

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
  private timeoutMap: { [key: string]: ReturnType<typeof setTimeout> } = {}

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
          ? { handler: subscription.handler.bind(this, channel) }
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
    const profile = this.iridium.profile.state

    setInterval(() => {
      const id = this.iridium.chat?.directConversationIdFromDid(profile.did)

      if (id && this.iridium.chat?.hasConversation(id)) {
        const conversation = this.iridium.chat?.getConversation(id)
        conversation.participants
          .filter((p) => p !== this.iridium.connector?.id)
          .forEach((p) => {
            this.sendWebrtc(p, {
              module: 'webrtc',
              type: 'peer:announce',
              did: this.iridium.connector.id,
              name: profile.name,
              address: profile.address,
              profilePicture: profile.profilePicture,
              at: Date.now().valueOf(),
            })
          })
      }

      const friends = Object.values(this.iridium.users.state)

      friends
        .filter((friend) => friend.did && friend.status !== 'online')
        .forEach((friend) => {
          this.sendWebrtc(friend.did, {
            module: 'webrtc',
            type: 'peer:announce',
            did: this.iridium.connector.id,
            name: profile.name,
            address: profile.address,
            profilePicture: profile.profilePicture,
            at: Date.now().valueOf(),
          })
        })
    }, announceFrequency)
  }

  private onMessage = (message: any, { payload }: { payload: any }) => {
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
    const { did, callId, peers, signal } = payload

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
        signal,
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

  // FIX ON ANOTHER TICKET
  private onPeerTyping = ({ did }: { did: string }) => {
    if (!did) return

    const id = this.iridium.chat?.directConversationIdFromDid(did)

    if (id && this.iridium.chat?.hasConversation(id)) {
      const conversation = this.iridium.chat?.getConversation(id)
      const typingParticipant = conversation.participants.find(
        (participant) => participant === did,
      )
      if (typingParticipant) {
        // this.iridium.chat.updateConversation({
        //   ...conversation,
        //   participants: conversation.participants.map((participant) => {
        //     if (participant.did === typingParticipant.did) {
        //       return {
        //         ...participant,
        //         activity: ConversationActivity.TYPING,
        //       }
        //     }
        //     return participant
        //   }),
        // })
      }

      clearTimeout(this.timeoutMap[did])
      delete this.timeoutMap[did]

      // this.timeoutMap[did] = setTimeout(() => {
      //   this.iridium.chat.updateConversation({
      //     ...conversation,
      //     participants: conversation.participants.map((participant) => {
      //       if (participant.did === did) {
      //         return {
      //           ...participant,
      //           activity: ConversationActivity.NOT_TYPING,
      //         }
      //       }
      //       return participant
      //     }),
      //   })
      // }, Config.chat.typingInputThrottle * 3)
    }
  }

  private onPeerAnnounce = (payload: any) => {
    const did = payload.did as string
    const requestFriend = this.iridium.users.getUser(did)

    if (!requestFriend || requestFriend.status === 'online') return

    // TO DO : move to usermanager
    this.iridium.users.setUser(requestFriend.did, {
      ...requestFriend,
      status: 'online',
    })
  }

  public onPeerMute = async ({
    did,
    kind,
  }: {
    did: string
    kind: 'audio' | 'video' | 'screen'
  }) => {
    Vue.set(this.state.streamMuted, did, {
      ...this.state.streamMuted[did],
      [kind]: true,
    })
  }

  public onPeerUnmute = async ({
    did,
    kind,
  }: {
    did: string
    kind: 'audio' | 'video' | 'screen'
  }) => {
    Vue.set(this.state.streamMuted, did, {
      ...this.state.streamMuted[did],
      [kind]: false,
    })
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
    signal,
    did,
  }: {
    callId: string
    peers: CallPeerDescriptor[]
    signal?: SignalData
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

    const call = $WebRTC.connect(
      usedCallId,
      peers,
      signal && did ? { [did]: signal } : {},
    )

    if (!call) {
      logger.log('webrtc/createCall', 'call invalid')
      return
    }

    const onCallIncoming = async ({ did }: { did: string }) => {
      call.peerDialingDisabled[did] = true
      if (this.state.activeCall?.callId === call.callId) {
        call.answer(did)
      }
      if (this.state.activeCall?.callId) {
        return
      }
      if (
        this.state.incomingCall === null &&
        (!call.active || this.state.activeCall?.callId !== call.callId)
      ) {
        const type = call.callId?.indexOf('|') > -1 ? 'group' : 'friend'
        logger.log(
          'webrtc/incomingCall',
          `incoming call #${call.callId} (${type})`,
        )

        this.state.incomingCall = {
          callId: call.callId,
          did,
          type,
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
      this.state.createdAt = Date.now()

      if (Vue.prototype.$nuxt.$store.state.audio.muted) {
        call.mute({ did: this.iridium.connector?.id, kind: 'audio' })
      }
      Vue.prototype.$nuxt.$store.commit('video/setDisabled', true, {
        root: true,
      })
      $Sounds.stopSound(Sounds.CALL)
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

      let muted: Boolean = true
      if (kind === 'audio') {
        muted = Vue.prototype.$nuxt.$store.state.audio.muted
      } else if (kind === 'video') {
        muted = Vue.prototype.$nuxt.$store.state.video.disabled
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
        `remote track received: ${track.kind}#${track.id} from ${did}`,
      )

      if (!kind) return

      Vue.set(this.state.streamMuted, did, {
        ...this.state.streamMuted[did],
        [kind]: false,
      })

      if (Vue.prototype.$nuxt.$store.state.audio.muted) {
        call.mute({ did: this.iridium.connector?.id, kind: 'audio' })
      }
    }
    call.on('REMOTE_TRACK_RECEIVED', onCallPeerTrack)

    const onPeerTrackUnmuted = async ({
      did,
      kind,
    }: {
      did: string
      trackId: string
      kind?: string
    }) => {
      logger.log('webrtc', `remote track unmuted: ${did} from ${did}`)
      if (!kind) return

      Vue.set(this.state.streamMuted, did, {
        ...this.state.streamMuted[did],
        [kind]: false,
      })
    }
    call.on('REMOTE_TRACK_UNMUTED', onPeerTrackUnmuted)

    const onRemoteTrackRemoved = async ({
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
        `remote track removed: ${track.kind}#${track.id} from ${did}`,
      )
      if (!kind) return

      Vue.set(this.state.streamMuted, did, {
        ...this.state.streamMuted[did],
        [kind]: true,
      })
    }
    call.on('REMOTE_TRACK_REMOVED', onRemoteTrackRemoved)

    const onRemoteTrackMuted = async ({
      did,
      kind,
    }: {
      did: string
      trackId: string
      kind?: string
    }) => {
      if (!kind) return

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
        [kind]: false,
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
      call.off('REMOTE_TRACK_REMOVED', onRemoteTrackRemoved)
      call.off('REMOTE_TRACK_MUTED', onRemoteTrackMuted)
      call.off('LOCAL_TRACK_REMOVED', onLocalTrackRemoved)
      call.off('STREAM', onStream)
      call.off('ANSWERED', onAnswered)
      call.off('DESTROY', onCallDestroy)
      $WebRTC.destroyCall(call.callId)
      $Sounds.stopSound(Sounds.CALL)
      $Sounds.playSound(Sounds.HANGUP)
    }
    call.on('DESTROY', onCallDestroy)
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

    Vue.set(this.state.streamMuted, this.iridium.connector?.id, {
      audio: true,
      video: true,
      screen: true,
    })

    const { callId, did } = this.state.incomingCall

    const call = $WebRTC.getCall(callId)

    if (!call) {
      return
    }

    await call.createLocalTracks(kinds)
    await call.answer(did)
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
  public sendTyping = async ({ did }: { did: string }) => {
    const id = this.iridium.chat?.directConversationIdFromDid(did)

    if (id && this.iridium.chat?.hasConversation(id)) {
      const conversation = this.iridium.chat?.getConversation(id)
      conversation.participants
        .filter((p) => p !== this.iridium.connector?.id)
        .forEach((p) => {
          this.sendWebrtc(p, {
            module: 'webrtc',
            type: 'peer:typing',
            did: this.iridium.connector.id,
            at: Date.now().valueOf(),
          })
        })
    }
  }

  // WILL BE REPLACED ONCE DIRECT SEND WITH IRIDIUM WORKS
  public sendWebrtc(did: string, payload: any) {
    this.iridium.connector?.publish('webrtc', payload, {
      encrypt: { recipients: [did] },
    })
  }
}
