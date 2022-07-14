import { Emitter } from '@satellite-im/iridium'
import merge from 'deepmerge'
import Vue from 'vue'
import { SignalData } from 'simple-peer'
import iridium, { IridiumManager } from '../IridiumManager'
import { setInObject } from '../utils'
import { overwriteMerge } from '~/utilities/merge'
import { WebRTCState } from '~/libraries/Iridium/webrtc/types'
import Logger from '~/utilities/Logger'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import { TrackKind } from '~/libraries/WebRTC/types'
import { WebRTCErrors } from '~/libraries/WebRTC/errors/Errors'
import { CallPeerDescriptor } from '~/libraries/WebRTC/Call'

const initialState: WebRTCState = {
  initialized: false,
  originator: '',
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
    this.state = new Proxy(initialState, {
      set(target, key, value) {
        console.log(`${key} set from ${target[key]} to ${value}`)
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
    console.log(
      'this.iridium.connector?.peerId',
      this.iridium.connector?.peerId,
    )
    this.state.initialized = true
    this.state.originator = this.iridium.connector?.peerId
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
    if (!this.iridium.connector?._peers[peerId]) {
      return
    }
    this.iridium.connector?.on(
      this.iridium.connector?._peers[peerId].channel,
      this.onMessage,
    )
  }

  private onMessage(message: any) {
    console.log('message', message)

    if (!message.payload.module || message.payload.module !== 'webrtc') {
      return
    }

    const { type, payload } = message.payload

    switch (type) {
      case 'peer:call':
        console.log('peer:call', payload)
        this.onPeerCall(payload)
        break
    }
  }

  private onPeerCall = (payload: any) => {
    const { peerId, callId, peers } = payload
    // update conversation participants with peers from call announcement
    const $Logger: Logger = Vue.prototype.$Logger
    const loggerPrefix = 'webrtc/peer:call - '
    $Logger.log(loggerPrefix, `incoming call with callId: ${payload.callId}`)

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

    if (!call) {
      $Logger.log(loggerPrefix, `create a call...`)
      // dispatch('createCall', payload)
      return
    }

    if (this.state.activeCall?.callId !== call.callId) {
      $Logger.log(loggerPrefix, `No active call with call id: ${call.callId}`)
      return
    }

    const peerIdStr = peerId.toB58String()
    if (
      !call.peerConnected[peerIdStr] &&
      !call.peerDialingDisabled[peerIdStr]
    ) {
      $Logger.log(loggerPrefix, `initiate a call...`)
      // await call.initiateCall(peerIdStr)
    }
  }

  public async call(recipient: any, kinds: TrackKind[]) {
    const $Logger: Logger = Vue.prototype.$Logger

    // check permission for audio call
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
    } catch (e) {
      throw new Error(WebRTCErrors.PERMISSION_DENIED)
    }

    let conversation

    try {
      conversation = await iridium.chat?.getConversation(recipient.did)
    } catch (e) {
      console.log(e)
    }

    if (!conversation) {
      return
    }

    console.log('conversation', conversation)

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

      const peers = participants.map((did) => {
        if (did === callId) {
          const { name, peerId } = this.iridium.friends.getFriend(did)
          return {
            name,
            peerId,
          }
        }
        const { name, peerId } = this.iridium.profile.state
        return {
          name,
          peerId,
        }
      })

      console.log('peers', peers)

      await this.createCall({
        callId,
        peers,
        peerId: recipient.peerId,
      })
    }

    const call = $WebRTC.getCall(callId)
    console.log('call', call)
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
    this.state.activeCall = { callId }

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

    if (!$WebRTC.initialized && this.state.originator) {
      $WebRTC.init(this.state.originator)
    }

    const usedCallId = callId === this.state.originator ? peerId : callId
    console.log('usedCallId', usedCallId)
    if (!usedCallId) {
      throw new Error('webrtc: invalid callId provided: ' + callId)
    }
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

    function onCallIncoming({ peerId }: { peerId: string }) {
      // call.peerDialingDisabled[peerId] = true
      // if (state.activeCall?.callId === call.callId) {
      //   call.answer(peerId)
      //   return
      // }
      // if (state.activeCall?.callId) {
      //   return
      // }
      // if (
      //   state.incomingCall === undefined &&
      //   (!call.active || state.activeCall?.callId !== call.callId)
      // ) {
      //   const type = call.callId?.indexOf('|') > -1 ? 'group' : 'friend'
      //   $Logger.log(
      //     'webrtc/incomingCall',
      //     `incoming call #${call.callId} (${type})`,
      //   )
      //   commit('setIncomingCall', {
      //     callId: call.callId,
      //     peerId,
      //     type,
      //   })
      // }
      // commit('ui/showMedia', true, { root: true })
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

    function onCallPeerTrack({
      track,
      peerId,
      kind,
    }: {
      track: MediaStreamTrack
      peerId: string
      kind?: string
    }) {
      $Logger.log(
        'webrtc',
        `remote track received: ${track.kind}#${track.id} from ${peerId}`,
      )
      // commit('setMuted', {
      //   peerId,
      //   kind,
      //   muted: false,
      // })
      // if (rootState.audio.muted) {
      //   call.mute({ peerId: iridium.connector?.peerId, kind: 'audio' })
      // }
    }
    call.on('REMOTE_TRACK_RECEIVED', onCallPeerTrack)

    function onPeerTrackUnmuted({
      peerId,
      trackId,
      kind,
    }: {
      peerId: string
      trackId: string
      kind?: string
    }) {
      // commit('setMuted', {
      //   peerId,
      //   kind,
      //   muted: false,
      // })
    }
    call.on('REMOTE_TRACK_UNMUTED', onPeerTrackUnmuted)

    function onRemoteTrackRemoved({
      track,
      peerId,
      kind,
    }: {
      track: MediaStreamTrack
      peerId: string
      kind?: string
    }) {
      $Logger.log(
        'webrtc',
        `remote track removed: ${track.kind}#${track.id} from ${peerId}`,
      )
      // commit('setMuted', {
      //   peerId,
      //   kind,
      //   muted: true,
      // })
    }
    call.on('REMOTE_TRACK_REMOVED', onRemoteTrackRemoved)

    function onRemoteTrackMuted({
      peerId,
      trackId,
      kind,
    }: {
      peerId: string
      trackId: string
      kind?: string
    }) {
      // commit('setMuted', {
      //   peerId,
      //   kind,
      //   muted: true,
      // })
    }
    call.on('REMOTE_TRACK_MUTED', onRemoteTrackMuted)

    function onLocalTrackRemoved({
      track,
      kind,
    }: {
      track: MediaStreamTrack
      kind?: string
    }) {
      $Logger.log('webrtc', `local track removed: ${kind}#${track.id}`)
      // commit('setMuted', {
      //   peerId: iridium.connector?.peerId,
      //   kind,
      //   muted: true,
      // })
    }
    call.on('LOCAL_TRACK_REMOVED', onLocalTrackRemoved)

    function onStream({ peerId, kind }: { peerId: string; kind?: string }) {
      // commit('setMuted', { peerId, kind, muted: false })
    }
    call.on('STREAM', onStream)

    function onAnswered({ peerId }: { peerId: string }) {
      // commit('setIncomingCall', undefined)
      // commit('setActiveCall', { callId, peerId })
    }
    call.on('ANSWERED', onAnswered)

    function onCallDestroy() {
      // commit('setIncomingCall', undefined)
      // commit('setActiveCall', undefined)
      // commit('updateCreatedAt', 0)
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
