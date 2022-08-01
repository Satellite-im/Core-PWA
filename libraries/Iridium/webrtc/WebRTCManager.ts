import { Emitter, Iridium } from '@satellite-im/iridium'
import { SignalData } from 'simple-peer'
import Vue from 'vue'
import iridium, { IridiumManager } from '../IridiumManager'
import { WebRTCState } from '~/libraries/Iridium/webrtc/types'
import { CallPeerDescriptor } from '~/libraries/WebRTC/Call'

import { Friend } from '~/libraries/Iridium/friends/types'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'
import { TrackKind } from '~/libraries/WebRTC/types'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import { ConversationActivity } from '~/libraries/Iridium/chat/types'
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

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
    this.state = initialState
  }

  async init() {
    await this.fetch()
    this.setupListeners()
    await this.subscribeToAnnounce()
    await this.subscribeToBroadcast()
  }

  async fetch() {
    this.state = {
      ...this.state,
      ...(await this.get('/')),
    }
    return this.state
  }

  get isBackgroundCall() {
    if (!this.state.activeCall?.callId) {
      return false
    }
    const conversationId = $nuxt.$route.params.id
    if (!conversationId) {
      return true
    }
    return this.state.activeCall.callId !== conversationId
  }

  get isActiveCall() {
    if (!this.state.activeCall?.callId) {
      return false
    }
    const conversationId = $nuxt.$route.params.id
    if (!conversationId) {
      return false
    }
    return this.state.activeCall.callId === conversationId
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

  private subscribeToBroadcast = async () => {
    await Promise.all([
      this.iridium.connector?.subscribe(
        `peer:signal/${this.iridium.connector?.peerId}`,
      ),
      this.iridium.connector?.subscribe(
        `peer:refuse/${this.iridium.connector?.peerId}`,
      ),
      this.iridium.connector?.subscribe(
        `peer:hangup/${this.iridium.connector?.peerId}`,
      ),
      this.iridium.connector?.subscribe(
        `peer:screenshare/${this.iridium.connector?.peerId}`,
      ),
      this.iridium.connector?.subscribe(
        `peer:mute/${this.iridium.connector?.peerId}`,
      ),
      this.iridium.connector?.subscribe(
        `peer:unmute/${this.iridium.connector?.peerId}`,
      ),
    ])
  }

  private setupListeners() {
    this.iridium.connector?.on(
      'peer:discovery',
      ({ peerId }: { peerId: string }) => {
        const loggerPrefix = 'webrtc/peer:discovery - '

        if (!peerId) return
        let did = ''
        try {
          did = Iridium.peerIdToDID(peerId)
        } catch (error) {}

        const connectedFriend = this.iridium.friends.getFriend(did)

        if (!connectedFriend) return

        logger.log(loggerPrefix, `discovered peer: ${peerId}`)

        this.iridium.friends.updateFriend(did, {
          ...connectedFriend,
          status: 'online',
        })
      },
    )
    this.iridium.connector?.on(
      'peer:connect',
      ({ peerId }: { peerId: string }) => {
        const loggerPrefix = 'webrtc/peer:connect - '

        if (!peerId) return
        let did = ''
        try {
          did = Iridium.peerIdToDID(peerId)
        } catch (error) {}

        const id = this.iridium.chat?.directConversationIdFromDid(did)

        if (id && this.iridium.chat?.hasConversation(id)) {
          const conversation = this.iridium.chat?.getConversation(id)
          const connectedParticipant = conversation.participants.find(
            (participant) => participant.peerId === peerId,
          )
          if (connectedParticipant) {
            logger.log(loggerPrefix, `connected participant: ${peerId}`)
            this.iridium.chat.updateConversation({
              ...conversation,
              participants: conversation.participants.map((participant) => {
                if (participant.peerId === connectedParticipant.peerId) {
                  return {
                    ...participant,
                    state: 'CONNECTED',
                  }
                }
                return participant
              }),
            })
          }
        }

        const connectedFriend = this.iridium.friends.getFriend(did)

        if (!connectedFriend) return

        logger.log(loggerPrefix, `connected friend: ${peerId}`)

        this.iridium.friends.updateFriend(did, {
          ...connectedFriend,
          status: 'online',
        })
      },
    )
    this.iridium.connector?.on(
      'peer:disconnect',
      ({ peerId }: { peerId: string }) => {
        const loggerPrefix = 'webrtc/peer:disconnect - '

        if (!peerId) return
        let did = ''
        try {
          did = Iridium.peerIdToDID(peerId)
        } catch (error) {}

        const id = this.iridium.chat?.directConversationIdFromDid(did)

        if (id && this.iridium.chat?.hasConversation(id)) {
          const conversation = this.iridium.chat?.getConversation(id)
          const disconnectedParticipant = conversation.participants.find(
            (participant) => participant.peerId === peerId,
          )
          if (disconnectedParticipant) {
            logger.log(loggerPrefix, `disconnected participant: ${peerId}`)
            this.iridium.chat.updateConversation({
              ...conversation,
              participants: conversation.participants.map((participant) => {
                if (participant.peerId === disconnectedParticipant.peerId) {
                  return {
                    ...participant,
                    state: 'DISCONNECTED',
                  }
                }
                return participant
              }),
            })
          }
        }

        const disconnectedFriend = this.iridium.friends.getFriend(did)

        if (!disconnectedFriend) return

        logger.log(loggerPrefix, `discovered peer: ${peerId}`)

        this.iridium.friends.updateFriend(did, {
          ...disconnectedFriend,
          status: 'offline',
        })

        $WebRTC.calls.forEach((call) => {
          if (call.peers[peerId]) {
            call.destroyPeer(peerId)
            delete call.peers[peerId]
          }
        })
      },
    )
  }

  private subscribeToAnnounce = async () => {
    const profile = this.iridium.profile.state

    setInterval(() => {
      const id = this.iridium.chat?.directConversationIdFromDid(profile.did)

      if (id && this.iridium.chat?.hasConversation(id)) {
        const conversation = this.iridium.chat?.getConversation(id)
        conversation.participants
          .filter(
            (p) => p.peerId && p.peerId !== this.iridium.connector?.peerId,
          )
          .forEach((p) => {
            this.iridium.connector?.send(
              {
                module: 'webrtc',
                type: 'peer:announce',
                payload: {
                  name: profile.name,
                  address: profile.address,
                  profilePicture: profile.profilePicture,
                },
                at: Date.now().valueOf(),
              },
              { to: [p.peerId!] },
            )
          })
      }

      const friends = this.iridium.friends.getFriends()

      friends
        .filter((friend) => friend.peerId && friend.status !== 'online')
        .forEach((friend) => {
          this.iridium.connector?.send(
            {
              module: 'webrtc',
              type: 'peer:announce',
              payload: {
                name: profile.name,
                address: profile.address,
                profilePicture: profile.profilePicture,
              },
              at: Date.now().valueOf(),
            },
            { to: [friend.peerId!] },
          )
        })
    }, announceFrequency)
  }

  public subscribeToChannel(peerId: string) {
    // @ts-ignore
    if (!peerId || !this.iridium.connector?._peers[peerId]) {
      return
    }

    this.iridium.connector?.on(
      // @ts-ignore
      this.iridium.connector?._peers[peerId].channel,
      this.onMessage,
    )
  }

  private onMessage = async (message: any) => {
    console.log('message', message)

    if (!message.payload.module || message.payload.module !== 'webrtc') {
      return
    }

    const { type, payload } = message.payload

    switch (type) {
      case 'peer:call':
        console.log('peer:call', payload)
        await this.onPeerCall(payload)
        break
      case 'peer:typing':
        console.log('peer:typing', payload)
        await this.onPeerTyping(payload)
        break
      case 'peer:announce':
        console.log('peer:announce', payload)
        await this.onPeerAnnounce(payload)
        break
      case 'peer:mute':
        console.log('peer:mute', payload)
        await this.onPeerMute(payload)
        break
      case 'peer:unmute':
        console.log('peer:unmute', payload)
        await this.onPeerUnmute(payload)
        break
    }
  }

  private onPeerCall = async (payload: any) => {
    const { peerId, callId, peers, signal } = payload

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
        peerId,
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

    if (!call.peerConnected[peerId] && !call.peerDialingDisabled[peerId]) {
      logger.log(loggerPrefix, `initiate a call...`)
      await call.initiateCall(peerId)
    }
  }

  private onPeerTyping = ({ peerId }: { peerId: string }) => {
    if (!peerId) return
    let did = ''
    try {
      did = Iridium.peerIdToDID(peerId)
    } catch (error) {}

    const id = this.iridium.chat?.directConversationIdFromDid(did)

    if (id && this.iridium.chat?.hasConversation(id)) {
      const conversation = this.iridium.chat?.getConversation(id)
      const typingParticipant = conversation.participants.find(
        (participant) => participant.peerId === peerId,
      )
      if (typingParticipant) {
        this.iridium.chat.updateConversation({
          ...conversation,
          participants: conversation.participants.map((participant) => {
            if (participant.peerId === typingParticipant.peerId) {
              return {
                ...participant,
                activity: ConversationActivity.TYPING,
              }
            }
            return participant
          }),
        })
      }
    }

    // clearTimeout(timeoutMap[peerId])
    // delete timeoutMap[peerId]
    //
    // timeoutMap[peerId] = setTimeout(() => {
    //   commit(
    //     'conversation/updateParticipant',
    //     {
    //       peerId: peerId.toB58String(),
    //       activity: ConversationActivity.NOT_TYPING,
    //     },
    //     { root: true },
    //   )
    // }, Config.chat.typingInputThrottle * 3)
  }

  private onPeerAnnounce = ({
    peerId,
    payload,
  }: {
    peerId: string
    payload: any
  }) => {
    if (!peerId) return
    let did = ''
    try {
      did = Iridium.peerIdToDID(peerId)
    } catch (error) {}

    const id = this.iridium.chat?.directConversationIdFromDid(did)

    if (id && this.iridium.chat?.hasConversation(id)) {
      const conversation = this.iridium.chat?.getConversation(id)
      const requestParticipant = conversation.participants.find(
        (participant) => participant.peerId === peerId,
      )
      if (requestParticipant) {
        this.iridium.chat.updateConversation({
          ...conversation,
          participants: conversation.participants.map((participant) => {
            if (participant.peerId === requestParticipant.peerId) {
              return {
                ...participant,
                state: 'CONNECTED',
                name: payload.name,
                profilePicture: payload.profilePicture,
              }
            }
            return participant
          }),
        })
      }
    }

    const requestFriend = this.iridium.friends.getFriend(did)

    if (!requestFriend) return

    this.iridium.friends.updateFriend(did, {
      ...requestFriend,
      status: 'online',
    })
  }

  private onPeerMute = async ({
    peerId,
    kind,
  }: {
    peerId: string
    kind: 'audio' | 'video' | 'screen'
  }) => {
    Vue.set(this.state.streamMuted, peerId, {
      ...this.state.streamMuted[peerId],
      [kind]: true,
    })
  }

  private onPeerUnmute = async ({
    peerId,
    kind,
  }: {
    peerId: string
    kind: 'audio' | 'video' | 'screen'
  }) => {
    Vue.set(this.state.streamMuted, peerId, {
      ...this.state.streamMuted[peerId],
      [kind]: false,
    })
  }

  public async call(recipient: Friend, kinds: TrackKind[]) {
    if (!this.iridium.connector?.peerId) {
      logger.error('webrtc', 'call - connector.peerId not found')
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

      const peers = participants.map((participant) => ({
        name: participant.name,
        id: participant.peerId,
      }))

      await this.createCall({
        callId,
        peers,
        peerId: recipient.peerId,
      })
    }

    const call = $WebRTC.getCall(callId)

    if (!call) {
      logger.log('webrtc', `call - call not ready: ${callId}`)
      return
    }

    Vue.set(this.state.streamMuted, this.iridium.connector.peerId, {
      audio: !kinds.includes('audio'),
      video: !kinds.includes('video'),
      screen: !kinds.includes('screen'),
    })

    await call.createLocalTracks(kinds)

    Vue.set(this.state, 'incomingCall', null)
    Vue.set(this.state, 'activeCall', {
      callId,
      peerId: this.iridium.connector.peerId,
    })

    await call.start()
  }

  private createCall = async ({
    callId,
    peers,
    signal,
    peerId,
  }: {
    callId: string
    peers: CallPeerDescriptor[]
    signal?: SignalData
    peerId?: string
  }) => {
    logger.log('webrtc: creating call', callId + peers)

    if (!this.iridium.connector?.peerId) {
      logger.error('webrtc', 'call - connector.peerId not found')
      return
    }

    if (!$WebRTC.initialized && this.iridium.connector?.peerId) {
      $WebRTC.init(this.iridium.connector?.peerId)
    }

    const usedCallId =
      callId === this.iridium.connector?.peerId ? peerId : callId

    if (!usedCallId) {
      throw new Error('webrtc: invalid callId provided: ' + callId)
    }

    const call = $WebRTC.connect(
      usedCallId,
      peers,
      signal && peerId ? { [peerId]: signal } : {},
    )

    if (!call) {
      logger.log('webrtc/createCall', 'call invalid')
      return
    }

    const onCallIncoming = async ({ peerId }: { peerId: string }) => {
      call.peerDialingDisabled[peerId] = true
      if (this.state.activeCall?.callId === call.callId) {
        call.answer(peerId)
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

        Vue.set(this.state, 'incomingCall', {
          callId: call.callId,
          peerId,
          type,
        })
      }
      $Sounds.playSound(Sounds.CALL)
    }
    call.on('INCOMING_CALL', onCallIncoming)

    const onCallOutgoing = async ({ peerId }: { peerId: string }) => {
      Vue.set(this.state, 'incomingCall', null)
      Vue.set(this.state, 'activeCall', { callId, peerId })
      $Sounds.playSound(Sounds.CALL)
      // commit('ui/showMedia', true, { root: true })
    }
    call.on('OUTGOING_CALL', onCallOutgoing)

    const onCallConnected = async ({ peerId }: { peerId: string }) => {
      Vue.set(this.state, 'incomingCall', null)
      Vue.set(this.state, 'activeCall', { callId, peerId })
      Vue.set(this.state, 'createdAt', Date.now())
      // commit('conversation/setCalling', true, { root: true })
      // Vue.prototype.$nuxt.$store.commit('webrtc/updateCreatedAt', Date.now())
      if (Vue.prototype.$nuxt.$store.state.audio.muted) {
        call.mute({ peerId: this.iridium.connector?.peerId, kind: 'audio' })
      }
      Vue.prototype.$nuxt.$store.commit('video/setDisabled', true, {
        root: true,
      })
      $Sounds.stopSound(Sounds.CALL)
      $Sounds.playSound(Sounds.CONNECTED)
    }
    call.on('CONNECTED', onCallConnected)

    const onCallHangup = async () => {
      // Vue.prototype.$nuxt.$store.commit('webrtc/updateCreatedAt', 0)
      Vue.set(this.state, 'createdAt', 0)
      // commit('ui/showMedia', false, { root: true })
      // commit('conversation/setCalling', false, { root: true })
      Vue.set(this.state, 'incomingCall', null)
      Vue.set(this.state, 'activeCall', null)
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

      if (!this.iridium.connector?.peerId) {
        logger.error('webrtc', 'onCallTrack - connector.peerId not found')
        return
      }

      let muted: Boolean = true
      if (kind === 'audio') {
        muted = Vue.prototype.$nuxt.$store.state.audio.muted
      } else if (kind === 'video') {
        muted = Vue.prototype.$nuxt.$store.state.video.disabled
      }

      Vue.set(this.state.streamMuted, this.iridium.connector.peerId, {
        ...this.state.streamMuted[this.iridium.connector?.peerId],
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

      if (!this.iridium.connector?.peerId) {
        logger.error('webrtc', 'onCallTrack - connector.peerId not found')
        return
      }

      Vue.set(this.state.streamMuted, this.iridium.connector.peerId, {
        ...this.state.streamMuted[this.iridium.connector?.peerId],
        [kind]: false,
      })
    }
    call.on('LOCAL_TRACK_UNMUTED', onLocalTrackUnmuted)

    const onCallPeerTrack = async ({
      track,
      peerId,
      kind,
    }: {
      track: MediaStreamTrack
      peerId: string
      kind?: string
    }) => {
      logger.log(
        'webrtc',
        `remote track received: ${track.kind}#${track.id} from ${peerId}`,
      )

      if (!kind) return

      Vue.set(this.state.streamMuted, peerId, {
        ...this.state.streamMuted[peerId],
        [kind]: false,
      })

      if (Vue.prototype.$nuxt.$store.state.audio.muted) {
        call.mute({ peerId: this.iridium.connector?.peerId, kind: 'audio' })
      }
    }
    call.on('REMOTE_TRACK_RECEIVED', onCallPeerTrack)

    const onPeerTrackUnmuted = async ({
      peerId,
      kind,
    }: {
      peerId: string
      trackId: string
      kind?: string
    }) => {
      if (!kind) return

      Vue.set(this.state.streamMuted, peerId, {
        ...this.state.streamMuted[peerId],
        [kind]: false,
      })
    }
    call.on('REMOTE_TRACK_UNMUTED', onPeerTrackUnmuted)

    const onRemoteTrackRemoved = async ({
      track,
      peerId,
      kind,
    }: {
      track: MediaStreamTrack
      peerId: string
      kind?: string
    }) => {
      logger.log(
        'webrtc',
        `remote track removed: ${track.kind}#${track.id} from ${peerId}`,
      )
      if (!kind) return

      Vue.set(this.state.streamMuted, peerId, {
        ...this.state.streamMuted[peerId],
        [kind]: true,
      })
    }
    call.on('REMOTE_TRACK_REMOVED', onRemoteTrackRemoved)

    const onRemoteTrackMuted = async ({
      peerId,
      kind,
    }: {
      peerId: string
      trackId: string
      kind?: string
    }) => {
      if (!kind) return

      Vue.set(this.state.streamMuted, peerId, {
        ...this.state.streamMuted[peerId],
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

      if (!this.iridium.connector?.peerId) {
        logger.error(
          'webrtc',
          'onLocalTrackRemoved - connector.peerId not found',
        )
        return
      }

      Vue.set(this.state.streamMuted, this.iridium.connector.peerId, {
        ...this.state.streamMuted[this.iridium.connector?.peerId],
        [kind]: true,
      })
    }
    call.on('LOCAL_TRACK_REMOVED', onLocalTrackRemoved)

    const onStream = async ({
      peerId,
      kind,
    }: {
      peerId: string
      kind?: string
    }) => {
      if (!kind) return

      Vue.set(this.state.streamMuted, peerId, {
        ...this.state.streamMuted[peerId],
        [kind]: false,
      })
    }
    call.on('STREAM', onStream)

    const onAnswered = async ({ peerId }: { peerId: string }) => {
      Vue.set(this.state, 'incomingCall', null)
      Vue.set(this.state, 'activeCall', { callId, peerId })
    }
    call.on('ANSWERED', onAnswered)

    const onCallDestroy = async () => {
      Vue.set(this.state, 'incomingCall', null)
      Vue.set(this.state, 'activeCall', null)
      Vue.set(this.state, 'createdAt', 0)
      // Vue.prototype.$nuxt.$store.commit('webrtc/updateCreatedAt', 0)

      // commit('conversation/setCalling', false, { root: true })
      // commit('ui/fullscreen', false, { root: true })
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
    if (!this.iridium.connector?.peerId) {
      logger.error('webrtc', 'acceptCall - connector.peerId not found')
      return
    }

    if (!this.state.incomingCall) {
      logger.error('webrtc', 'acceptCall - no incoming call to accept')
      return
    }

    Vue.set(this.state.streamMuted, this.iridium.connector?.peerId, {
      audio: true,
      video: true,
      screen: true,
    })

    const { callId, peerId } = this.state.incomingCall

    const call = $WebRTC.getCall(callId)

    if (!call) {
      return
    }

    await call.createLocalTracks(kinds)
    await call.answer(peerId)
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
    Vue.set(this.state, 'activeCall', null)
    Vue.set(this.state, 'incomingCall', null)
  }

  public async toggleMute({
    peerId,
    kind,
  }: {
    peerId: string
    kind: 'audio' | 'video' | 'screen'
  }) {
    if (!this.state.activeCall || !peerId) {
      return
    }
    const call = $WebRTC.getCall(this.state.activeCall.callId)
    if (!call) {
      return
    }
    const isMuted = this.state.streamMuted[peerId]?.[kind]
    if (isMuted) {
      await call.unmute({ peerId, kind })
      $Sounds.playSound(Sounds.UNMUTE)
      return
    }
    await call.mute({ peerId, kind })
    $Sounds.playSound(Sounds.MUTE)
  }
}
