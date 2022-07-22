import { Emitter, Iridium } from '@satellite-im/iridium'
import merge from 'deepmerge'
import { SignalData } from 'simple-peer'
import Vue from 'vue'
import iridium, { IridiumManager } from '../IridiumManager'
import { setInObject } from '../utils'
import { WebRTCState } from '~/libraries/Iridium/webrtc/types'
import { CallPeerDescriptor } from '~/libraries/WebRTC/Call'

import { WebRTCErrors } from '~/libraries/WebRTC/errors/Errors'
import { TrackKind } from '~/libraries/WebRTC/types'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import Logger from '~/utilities/Logger'
import { overwriteMerge } from '~/utilities/merge'
import {
  ConversationActivity,
  ConversationParticipant,
} from '~/store/conversation/types'
import { Friend } from '~/libraries/Iridium/friends/types'
import { Config } from '~/config'

const announceFrequency = 5000

const initialState: WebRTCState = {
  incomingCall: undefined,
  activeCall: undefined,
  streamMuted: {},
  createdAt: 0,
  elapsedTime: '',
  interval: null,
}

export default class WebRTCManager extends Emitter {
  public readonly iridium: IridiumManager
  public state: WebRTCState

  constructor(iridium: IridiumManager) {
    super()
    this.iridium = iridium
    // this.state = initialState
    this.state = new Proxy(initialState, {
      set(target, key, value) {
        // console.log(`${key} set from ${target[key]} to ${value}`)
        target[key] = value
        Vue.prototype.$nuxt.$store.commit('webrtc/setProperty', {
          key,
          value,
        })
        return true
      },
    })
  }

  async init() {
    // await this.fetch()
    // console.log(
    //   'this.iridium.connector?.peerId',
    //   this.iridium.connector?.peerId,
    // )
    // await this.onPeerDiscovery({
    //   peerId: '12D3KooWM4bdDMvtajWRdbAc7nPH6ggZJtNu44hhXmbAkpXa2nom',
    // })
    // await this.onPeerConnect({
    //   did: 'did:key:z6MkqhVW4UbcjNjQLCVtAkbnAz9ie8c7SFsaGC95D7Lh44sD',
    //   peerId: '12D3KooWM4bdDMvtajWRdbAc7nPH6ggZJtNu44hhXmbAkpXa2nom',
    // })
    this.setupListeners()
    await this.subscribeToAnnounce()
  }

  private setupListeners() {
    this.iridium.connector?.on(
      'peer:discovery',
      ({ peerId }: { peerId: string }) => {
        console.log('peer:discovery peerId', peerId)
        const $Logger: Logger = Vue.prototype.$Logger
        const loggerPrefix = 'webrtc/peer:discovery - '

        if (!peerId) return
        let did = ''
        try {
          did = Iridium.peerIdToDID(peerId)
        } catch (error) {}

        const connectedFriend = this.iridium.friends.getFriend(did)

        if (!connectedFriend) return

        $Logger.log(loggerPrefix, `discovered peer: ${peerId}`)

        this.iridium.friends.updateFriend(did, {
          ...connectedFriend,
          status: 'online',
        })
      },
    )
    this.iridium.connector?.on(
      'peer:connect',
      async ({ peerId }: { peerId: string }) => {
        console.log('peer:connect peerId', peerId)
        const $Logger: Logger = Vue.prototype.$Logger
        const loggerPrefix = 'webrtc/peer:connect - '

        if (!peerId) return
        let did = ''
        try {
          did = Iridium.peerIdToDID(peerId)
        } catch (error) {}

        const id = await this.iridium.chat?.directConversationId(did)

        if (id && (await this.iridium.chat?.hasConversation(id))) {
          const conversation = await this.iridium.chat?.getConversation(id)
          const connectedParticipant = conversation.participants.find(
            (participant) => participant.peerId === peerId,
          )
          if (connectedParticipant) {
            $Logger.log(loggerPrefix, `connected participant: ${peerId}`)
            await this.iridium.chat.saveConversation({
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

        $Logger.log(loggerPrefix, `connected friend: ${peerId}`)

        this.iridium.friends.updateFriend(did, {
          ...connectedFriend,
          status: 'online',
        })
      },
    )
    this.iridium.connector?.on(
      'peer:disconnect',
      async ({ peerId }: { peerId: string }) => {
        console.log('peer:disconnect peerId', peerId)
        const $Logger: Logger = Vue.prototype.$Logger
        const loggerPrefix = 'webrtc/peer:disconnect - '

        if (!peerId) return
        let did = ''
        try {
          did = Iridium.peerIdToDID(peerId)
        } catch (error) {}

        const id = await this.iridium.chat?.directConversationId(did)

        if (id && (await this.iridium.chat?.hasConversation(id))) {
          const conversation = await this.iridium.chat?.getConversation(id)
          const disconnectedParticipant = conversation.participants.find(
            (participant) => participant.peerId === peerId,
          )
          if (disconnectedParticipant) {
            $Logger.log(loggerPrefix, `disconnected participant: ${peerId}`)
            await this.iridium.chat.saveConversation({
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

        $Logger.log(loggerPrefix, `discovered peer: ${peerId}`)

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

    setInterval(async () => {
      const id = await this.iridium.chat?.directConversationId(profile.did)

      if (id && (await this.iridium.chat?.hasConversation(id))) {
        const conversation = await this.iridium.chat?.getConversation(id)
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
              { to: [p.peerId] },
            )
          })
      }

      const friends = this.iridium.friends.getFriends()

      friends
        .filter((friend) => !!friend.peerId && friend.status !== 'online')
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
            { to: [friend.peerId] },
          )
        })
    }, announceFrequency)
  }

  private async fetch() {
    this.state = merge(initialState, await this.get(), {
      arrayMerge: overwriteMerge,
    })
  }

  get(path: string = '', options: any = {}) {
    return this.iridium.connector?.get(`/webrtc${path}`, options)
  }

  set(path: string = '', payload: any, options: any = {}) {
    const didSet = setInObject(this.state, path, payload)
    if (!didSet) {
      return
    }
    return this.iridium.connector?.set(`/webrtc${path}`, payload, options)
  }

  public subscribeToChannel(peerId: string) {
    console.log('subscribeToChannel peerId', peerId)
    console.log(
      'subscribeToChannel this.iridium.connector?._peers',
      this.iridium.connector?._peers,
    )

    if (!peerId || !this.iridium.connector?._peers[peerId]) {
      return
    }

    this.iridium.connector?.on(
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
      // case 'peer:signal':
      //   console.log('peer:signal', payload)
      //   await this.onPeerSignal(payload)
      //   break
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

  // private onPeerSignal = (payload: any) => {
  //   console.log('onPeerSignal', payload)
  // }

  private onPeerCall = async (payload: any) => {
    const { peerId, callId, peers, signal } = payload
    // update conversation participants with peers from call announcement
    const $Logger: Logger = Vue.prototype.$Logger
    const loggerPrefix = 'webrtc/peer:call - '
    $Logger.log(loggerPrefix, `incoming call with callId: ${payload.callId}`)

    console.log('onPeerCall peerId', peerId)
    console.log('onPeerCall callId', callId)
    console.log('onPeerCall peers', peers)

    // if (payload.peers) {
    //   payload.peers.forEach((peer) => {
    //     if (
    //       rootState.conversation.participants.find((p) => p.peerId === peer.id)
    //     ) {
    //       commit(
    //         'conversation/updateParticipant',
    //         {
    //           peerId: peer.id,
    //           name: peer.name,
    //         },
    //         { root: true },
    //       )
    //     }
    //   })
    // }

    if (!callId) {
      $Logger.log(loggerPrefix, `invalid callId`)
      return
    }

    const call = $WebRTC.getCall(callId)

    console.log('onPeerCall call', call)

    if (!call) {
      $Logger.log(loggerPrefix, `create a call...`)
      await this.createCall({
        peerId,
        callId,
        peers,
        signal,
      })
      return
    }

    console.log(
      'onPeerCall this.state.activeCall?.callId',
      this.state.activeCall?.callId,
    )

    console.log('onPeerCall call.peerConnected[peerId]', call.peerConnected)

    console.log(
      'onPeerCall call.peerDialingDisabled[peerId]',
      call.peerDialingDisabled,
    )

    if (this.state.activeCall?.callId !== call.callId) {
      $Logger.log(loggerPrefix, `No active call with call id: ${call.callId}`)
      return
    }

    if (!call.peerConnected[peerId] && !call.peerDialingDisabled[peerId]) {
      $Logger.log(loggerPrefix, `initiate a call...`)
      await call.initiateCall(peerId)
    }
  }

  private onPeerTyping = async ({ peerId }: { peerId: string }) => {
    if (!peerId) return
    let did = ''
    try {
      did = Iridium.peerIdToDID(peerId)
    } catch (error) {}

    const id = await this.iridium.chat?.directConversationId(did)

    if (id && (await this.iridium.chat?.hasConversation(id))) {
      const conversation = await this.iridium.chat?.getConversation(id)
      const typingParticipant = conversation.participants.find(
        (participant) => participant.peerId === peerId,
      )
      if (typingParticipant) {
        await this.iridium.chat.saveConversation({
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

  private onPeerAnnounce = async ({
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

    const id = await this.iridium.chat?.directConversationId(did)

    if (id && (await this.iridium.chat?.hasConversation(id))) {
      const conversation = await this.iridium.chat?.getConversation(id)
      const requestParticipant = conversation.participants.find(
        (participant) => participant.peerId === peerId,
      )
      if (requestParticipant) {
        await this.iridium.chat.saveConversation({
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

  private onPeerMute = ({
    peerId,
    kind,
  }: {
    peerId: string
    kind: 'audio' | 'video' | 'screen'
  }) => {
    this.state.streamMuted = {
      ...this.state.streamMuted,
      [peerId]: {
        ...this.state.streamMuted[peerId],
        [kind]: true,
      },
    }
  }

  private onPeerUnmute = ({
    peerId,
    kind,
  }: {
    peerId: string
    kind: 'audio' | 'video' | 'screen'
  }) => {
    this.state.streamMuted = {
      ...this.state.streamMuted,
      [peerId]: {
        ...this.state.streamMuted[peerId],
        [kind]: false,
      },
    }
  }

  public async call(recipient: Friend, kinds: TrackKind[]) {
    const $Logger: Logger = Vue.prototype.$Logger

    if (!recipient) {
      return
    }

    console.log('call recipient', recipient)
    console.log('call kinds', kinds)
    // check permission for audio call
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
    } catch (e) {
      throw new Error(WebRTCErrors.PERMISSION_DENIED)
    }

    const id = await iridium.chat?.directConversationId(recipient.did)

    if (!id || !(await this.iridium.chat?.hasConversation(id))) {
      return
    }

    const conversation = await this.iridium.chat?.getConversation(id)

    if (!conversation) {
      return
    }

    console.log('call conversation', conversation)

    const { id: callId, participants } = conversation

    if (!callId) {
      $Logger.log(
        'webrtc',
        `call - conversation not initialized or id not found`,
      )
      return
    }

    if (participants.length === 0) {
      $Logger.log('webrtc', `call - conversation has no participants`)
      return
    }

    if (!$WebRTC.calls.has(callId)) {
      $Logger.log('webrtc', `call - call not found: ${callId}, creating...`)

      const peers = participants.map((participant) => ({
        name: participant.name,
        id: participant.peerId,
      }))

      console.log('callId', callId)
      console.log('peers', peers)
      console.log('peerId', recipient.peerId)

      await this.createCall({
        callId,
        peers,
        peerId: recipient.peerId,
      })
    }

    const call = $WebRTC.getCall(callId)
    console.log('call call', call)
    if (!call) {
      $Logger.log('webrtc', `call - call not ready: ${callId}`)
      return
    }

    this.state.streamMuted = {
      ...this.state.streamMuted,
      [iridium.connector?.peerId]: {
        audio: !kinds.includes('audio'),
        video: !kinds.includes('video'),
        screen: !kinds.includes('screen'),
      },
    }

    this.state.incomingCall = undefined
    this.state.activeCall = { callId, participants }

    await call.createLocalTracks(kinds)
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
    const $Logger: Logger = Vue.prototype.$Logger

    $Logger.log('webrtc: creating call', callId + peers)

    if (!$WebRTC.initialized && this.iridium.connector?.peerId) {
      $WebRTC.init(this.iridium.connector?.peerId)
    }

    const usedCallId =
      callId === this.iridium.connector?.peerId ? peerId : callId
    console.log('usedCallId', usedCallId)
    if (!usedCallId) {
      throw new Error('webrtc: invalid callId provided: ' + callId)
    }

    console.log('peers', peers)
    const call = $WebRTC.connect(
      usedCallId,
      peers,
      signal && peerId ? { [peerId]: signal } : {},
    )

    console.log('call', call)

    if (!call) {
      $Logger.log('webrtc/createCall', 'call invalid')
      return
    }

    const onCallIncoming = ({ peerId }: { peerId: string }) => {
      console.log('onCallIncoming peerId', peerId)
      console.log('onCallIncoming this', this)
      call.peerDialingDisabled[peerId] = true
      if (this.state.activeCall?.callId === call.callId) {
        call.answer(peerId)
      }
      if (this.state.activeCall?.callId) {
        return
      }
      if (
        this.state.incomingCall === undefined &&
        (!call.active || this.state.activeCall?.callId !== call.callId)
      ) {
        const type = call.callId?.indexOf('|') > -1 ? 'group' : 'friend'
        $Logger.log(
          'webrtc/incomingCall',
          `incoming call #${call.callId} (${type})`,
        )
        this.state.incomingCall = {
          callId: call.callId,
          peerId,
          type,
        }
      }
    }
    call.on('INCOMING_CALL', onCallIncoming)

    function onCallOutgoing({ peerId }: { peerId: string }) {
      // console.log('onCallOutgoing', peerId)
      // this.state.incomingCall = undefined
      // this.state.activeCall = { callId, peerId }
      // commit('setIncomingCall', undefined)
      // commit('setActiveCall', { callId, peerId })
      // commit('ui/showMedia', true, { root: true })
    }
    call.on('OUTGOING_CALL', onCallOutgoing)

    function onCallConnected({ peerId }: { peerId: string }) {
      // commit('setIncomingCall', undefined)
      // commit('setActiveCall', { callId, peerId })
      // commit('conversation/setCalling', true, { root: true })
      // commit('updateCreatedAt', Date.now())
      // if (rootState.audio.muted) {
      //   call.mute({ peerId: iridium.connector?.peerId, kind: 'audio' })
      // }
      // commit('video/setDisabled', true, { root: true })
    }
    call.on('CONNECTED', onCallConnected)

    function onCallHangup() {
      // commit('updateCreatedAt', 0)
      // commit('ui/showMedia', false, { root: true })
      // commit('conversation/setCalling', false, { root: true })
      // commit('setIncomingCall', undefined)
      // commit('setActiveCall', undefined)
    }
    call.on('HANG_UP', onCallHangup)

    function onCallTrack({
      track,
      kind,
    }: {
      track: MediaStreamTrack
      stream: MediaStream
      kind?: string | undefined
    }) {
      $Logger.log('webrtc', `local track created: ${track.kind}#${track.id}`)
      // let muted: Boolean = true
      // if (kind === 'audio') {
      //   muted = rootState.audio.muted
      // } else if (kind === 'video') {
      //   muted = rootState.video.disabled
      // }
      // commit('setMuted', {
      //   peerId: iridium.connector?.peerId,
      //   kind,
      //   muted: !muted,
      // })
      // if (rootState.audio.muted) {
      //   call.mute({ peerId: iridium.connector?.peerId, kind: 'audio' })
      // }
    }
    call.on('LOCAL_TRACK_CREATED', onCallTrack)

    const onCallPeerTrack = ({
      track,
      peerId,
      kind,
    }: {
      track: MediaStreamTrack
      peerId: string
      kind: 'audio' | 'video' | 'screen'
    }) => {
      $Logger.log(
        'webrtc',
        `remote track received: ${track.kind}#${track.id} from ${peerId}`,
      )
      this.state.streamMuted = {
        ...this.state.streamMuted,
        [peerId]: {
          ...this.state.streamMuted[peerId],
          [kind]: false,
        },
      }
      // if (rootState.audio.muted) {
      //   call.mute({ peerId: iridium.connector?.peerId, kind: 'audio' })
      // }
    }
    call.on('REMOTE_TRACK_RECEIVED', onCallPeerTrack)

    const onPeerTrackUnmuted = ({
      peerId,
      kind,
    }: {
      peerId: string
      kind: 'audio' | 'video' | 'screen'
    }) => {
      this.state.streamMuted = {
        ...this.state.streamMuted,
        [peerId]: {
          ...this.state.streamMuted[peerId],
          [kind]: false,
        },
      }
    }
    call.on('REMOTE_TRACK_UNMUTED', onPeerTrackUnmuted)

    const onRemoteTrackRemoved = ({
      track,
      peerId,
      kind,
    }: {
      track: MediaStreamTrack
      peerId: string
      kind: 'audio' | 'video' | 'screen'
    }) => {
      $Logger.log(
        'webrtc',
        `remote track removed: ${track.kind}#${track.id} from ${peerId}`,
      )
      this.state.streamMuted = {
        ...this.state.streamMuted,
        [peerId]: {
          ...this.state.streamMuted[peerId],
          [kind]: true,
        },
      }
    }
    call.on('REMOTE_TRACK_REMOVED', onRemoteTrackRemoved)

    const onRemoteTrackMuted = ({
      peerId,
      kind,
    }: {
      peerId: string
      kind: 'audio' | 'video' | 'screen'
    }) => {
      this.state.streamMuted = {
        ...this.state.streamMuted,
        [peerId]: {
          ...this.state.streamMuted[peerId],
          [kind]: true,
        },
      }
    }
    call.on('REMOTE_TRACK_MUTED', onRemoteTrackMuted)

    const onLocalTrackRemoved = ({
      track,
      kind,
    }: {
      track: MediaStreamTrack
      kind: 'audio' | 'video' | 'screen'
    }) => {
      $Logger.log('webrtc', `local track removed: ${kind}#${track.id}`)
      this.state.streamMuted = {
        ...this.state.streamMuted,
        [this.iridium.connector?.peerId]: {
          ...this.state.streamMuted[this.iridium.connector?.peerId],
          [kind]: true,
        },
      }
    }
    call.on('LOCAL_TRACK_REMOVED', onLocalTrackRemoved)

    const onStream = ({ peerId, kind }: { peerId: string; kind?: string }) => {
      this.state.streamMuted = {
        ...this.state.streamMuted,
        [peerId]: {
          ...this.state.streamMuted[peerId],
          [kind]: false,
        },
      }
    }
    call.on('STREAM', onStream)

    const onAnswered = ({ peerId }: { peerId: string }) => {
      this.state.incomingCall = undefined
      this.state.activeCall = { callId, peerId }
    }
    call.on('ANSWERED', onAnswered)

    const onCallDestroy = () => {
      this.state.incomingCall = undefined
      this.state.incomingCall = undefined
      this.state.createdAt = 0

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
    }
    call.on('DESTROY', onCallDestroy)
  }
}
