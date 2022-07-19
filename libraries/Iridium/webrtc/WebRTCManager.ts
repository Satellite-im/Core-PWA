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
import {
  ConversationActivity,
  ConversationParticipant,
} from '~/store/conversation/types'
import { Config } from '~/config'

const announceFrequency = 5000

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

    this.subscribeToAnnounce()
    // await this.onPeerDiscovery({
    //   peerId: '12D3KooWM4bdDMvtajWRdbAc7nPH6ggZJtNu44hhXmbAkpXa2nom',
    // })
    await this.onPeerConnect({
      did: 'did:key:z6MkqhVW4UbcjNjQLCVtAkbnAz9ie8c7SFsaGC95D7Lh44sD',
      peerId: '12D3KooWM4bdDMvtajWRdbAc7nPH6ggZJtNu44hhXmbAkpXa2nom',
    })
    this.state.originator = this.iridium.connector?.peerId
    this.state.initialized = true
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
    console.log(
      'this.iridium.connector?._peers',
      this.iridium.connector?._peers,
    )
    if (!this.iridium.connector?._peers[peerId]) {
      return
    }

    this.iridium.connector?.on(
      this.iridium.connector?._peers[peerId].channel,
      this.onMessage,
    )
    console.log(
      `subscribe to ${this.iridium.connector?._peers[peerId].channel}`,
    )
  }

  private onMessage = async (message: any) => {
    console.log('message', message)

    if (!message.payload.module || message.payload.module !== 'webrtc') {
      return
    }

    const { type, payload } = message.payload

    switch (type) {
      case 'peer:discovery':
        console.log('peer:discovery', payload)
        await this.onPeerDiscovery(payload)
        break
      case 'peer:connect':
        console.log('peer:connect', payload)
        await this.onPeerConnect(payload)
        break
      case 'peer:call':
        console.log('peer:call', payload)
        await this.onPeerCall(payload)
        break
      case 'peer:disconnect':
        console.log('peer:disconnect', payload)
        await this.onPeerDisconnect(payload)
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

  private subscribeToAnnounce = () => {
    // setInterval(() => {
    //   if (rootState.conversation) {
    //     rootState.conversation.participants
    //       .filter((p) => p.peerId && p.peerId !== iridium.connector?.peerId)
    //       .forEach((p) => {
    //         iridium.connector.send(
    //           {
    //             type: 'peer:announce',
    //             payload: {
    //               name: rootState.accounts.details?.name,
    //               address: rootState.accounts.details?.address,
    //               profilePicture: rootState.accounts.details?.profilePicture,
    //             },
    //             sentAt: Date.now().valueOf(),
    //           },
    //           p.peerId as string,
    //         )
    //       })
    //   }
    //   rootState.friends.all
    //     .filter((friend) => !!friend.peerId && friend.state !== 'online')
    //     .forEach((friend) => {
    //       iridium.connector?.sendMessage(
    //         {
    //           type: 'peer:announce',
    //           payload: {
    //             name: rootState.accounts.details?.name,
    //             address: rootState.accounts.details?.address,
    //             profilePicture: rootState.accounts.details?.profilePicture,
    //           },
    //           sentAt: Date.now().valueOf(),
    //         },
    //         friend.peerId as string,
    //       )
    //     })
    // }, announceFrequency)
  }

  private onPeerDiscovery = async (payload: any) => {
    const $Logger: Logger = Vue.prototype.$Logger
    const loggerPrefix = 'webrtc/peer:discovery - '

    const { peerId } = payload

    const friends = await this.iridium.friends.getFriends()

    console.log('friends', friends)

    let connectedFriend = null

    for (const key in friends) {
      if (friends[key].peerId === peerId) {
        connectedFriend = friends[key]
        break
      }
    }

    console.log('connectedFriend', connectedFriend)

    if (!connectedFriend) return

    $Logger.log(loggerPrefix, `discovered peer: ${peerId}`)
    // dispatch(
    //   'friends/setFriendState',
    //   {
    //     address: connectedFriend.address,
    //     state: 'online',
    //   },
    //   { root: true },
    // )
    // dispatch('textile/subscribeToMailbox', {}, { root: true })
  }

  private onPeerConnect = async (payload: any) => {
    const $Logger: Logger = Vue.prototype.$Logger
    const loggerPrefix = 'webrtc/peer:connect - '

    const { peerId, did } = payload

    const id = await this.iridium.chat?.directConversationId(did)

    console.log('id', id)

    if (!id || !(await this.iridium.chat?.hasConversation(id))) {
      return
    }

    const conversation = await this.iridium.chat?.getConversation(id)

    console.log('conversation', conversation)

    if (!conversation) {
      return
    }

    console.log(
      'this.iridium.profile?.state.did',
      this.iridium.profile?.state.did,
    )

    const connectedParticipantId = conversation.participants.find(
      (participant) => {
        return participant !== this.iridium.profile?.state.did
      },
    )

    if (!connectedParticipantId) {
      return
    }

    console.log('connectedParticipantId', connectedParticipantId)

    const connectedParticipant = await this.iridium.friends.getFriend(
      connectedParticipantId,
    )

    if (!connectedParticipant || connectedParticipant.peerId !== peerId) {
      return
    }

    console.log('connectedParticipant', connectedParticipant)

    $Logger.log(loggerPrefix, `connected participant: ${peerId}`)

    // commit(
    //   'conversation/updateParticipant',
    //   {
    //     peerId: connectedParticipant.peerId,
    //     state: 'CONNECTED',
    //   },
    //   { root: true },
    // )

    const friends = await this.iridium.friends.getFriends()

    console.log('friends', friends)

    let connectedFriend = null

    for (const key in friends) {
      if (friends[key].peerId === peerId) {
        connectedFriend = friends[key]
        break
      }
    }

    console.log('connectedFriend', connectedFriend)

    if (!connectedFriend) return

    $Logger.log(loggerPrefix, `connected friend: ${peerId}`)

    // dispatch(
    //   'friends/setFriendState',
    //   {
    //     address: connectedFriend.address,
    //     state: 'online',
    //   },
    //   { root: true },
    // )
    // dispatch('textile/subscribeToMailbox', {}, { root: true })
  }

  private onPeerCall = async (payload: any) => {
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

    console.log('callId', callId)

    if (!callId) {
      $Logger.log(loggerPrefix, `invalid callId`)
      return
    }

    const call = $WebRTC.getCall(callId)

    console.log('call', call)

    if (!call) {
      $Logger.log(loggerPrefix, `create a call...`)
      await this.createCall({
        callId,
        peers,
        peerId,
      })
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
      await call.initiateCall(peerIdStr)
    }
  }

  private onPeerDisconnect = async (payload: any) => {
    const $Logger: Logger = Vue.prototype.$Logger
    const loggerPrefix = 'webrtc/peer:disconnect - '

    const { peerId, did } = payload

    const id = await this.iridium.chat?.directConversationId(did)

    console.log('id', id)

    if (!id || !(await this.iridium.chat?.hasConversation(id))) {
      return
    }

    const conversation = await this.iridium.chat?.getConversation(id)

    console.log('conversation', conversation)

    if (!conversation) {
      return
    }

    console.log(
      'this.iridium.profile?.state.did',
      this.iridium.profile?.state.did,
    )

    const disconnectedParticipantId = conversation.participants.find(
      (participant) => {
        return participant !== this.iridium.profile?.state.did
      },
    )

    if (!disconnectedParticipantId) {
      return
    }

    const disconnectedParticipant = await this.iridium.friends.getFriend(
      disconnectedParticipantId,
    )

    if (!disconnectedParticipant || disconnectedParticipant.peerId !== peerId) {
      return
    }

    $Logger.log(loggerPrefix, 'disconnected participant: ', {
      peerId,
    })

    // commit(
    //   'conversation/updateParticipant',
    //   {
    //     peerId: disconnectedParticipant.peerId,
    //     state: 'DISCONNECTED',
    //   },
    //   { root: true },
    // )

    const friends = await this.iridium.friends.getFriends()

    console.log('friends', friends)

    let disconnectedFriend = null

    for (const key in friends) {
      if (friends[key].peerId === peerId) {
        disconnectedFriend = friends[key]
        break
      }
    }

    console.log('disconnectedFriend', disconnectedFriend)

    if (disconnectedFriend) {
      $Logger.log(loggerPrefix, 'disconnected friend: ', {
        peerId,
      })
      // dispatch(
      //   'friends/setFriendState',
      //   {
      //     address: disconnectedFriend.address,
      //     state: 'offline',
      //   },
      //   { root: true },
      // )
    }

    const peerHash = peerId
    $WebRTC.calls.forEach((call) => {
      if (call.peers[peerHash]) {
        call.destroyPeer(peerHash)
        delete call.peers[peerHash]
      }
    })
  }

  private onPeerTyping = async (payload: any) => {
    const { peerId } = payload

    // commit(
    //   'conversation/updateParticipant',
    //   {
    //     peerId: peerId.toB58String(),
    //     activity: ConversationActivity.TYPING,
    //   },
    //   { root: true },
    // )

    // clearTimeout(timeoutMap[peerId])
    // delete timeoutMap[peerId]

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

    // dispatch('textile/subscribeToMailbox', {}, { root: true })
  }

  private onPeerAnnounce = async (payload: any) => {
    const { peerId } = payload

    // const requestParticipant = rootState.conversation.participants.find(
    //   (p) =>
    //     p.peerId === peerId.toB58String() ||
    //     (payload.address && p.address === payload.address),
    // )
    // if (requestParticipant) {
    //   commit(
    //     'conversation/updateParticipant',
    //     {
    //       peerId: requestParticipant.peerId,
    //       state: 'CONNECTED',
    //       name: payload.name,
    //       profilePicture: payload.profilePicture,
    //     },
    //     { root: true },
    //   )
    // }

    const friends = await this.iridium.friends.getFriends()

    console.log('friends', friends)

    let requestFriend = null

    for (const key in friends) {
      if (friends[key].peerId === peerId) {
        requestFriend = friends[key]
        break
      }
    }

    if (!requestFriend || requestFriend.state === 'online') return

    console.log('requestFriend', requestFriend)
    // dispatch(
    //   'friends/setFriendState',
    //   {
    //     address: requestFriend.address,
    //     state: 'online',
    //   },
    //   { root: true },
    // )
    // dispatch('textile/subscribeToMailbox', {}, { root: true })
  }

  private onPeerMute = async (payload: any) => {
    const { peerId, callId, trackId, kind } = payload

    // const peerIdStr = peerId.toB58String()
    // commit('setMuted', {
    //   peerId,
    //   kind,
    //   callId,
    //   trackId,
    //   muted: true,
    // })
  }

  private onPeerUnmute = async (payload: any) => {
    const { peerId, callId, trackId, kind } = payload

    // const peerIdStr = peerId.toB58String()
    // commit('setMuted', {
    //   peerId,
    //   kind,
    //   callId,
    //   trackId,
    //   muted: false,
    // })
  }

  public async call(recipient: any, kinds: TrackKind[]) {
    const $Logger: Logger = Vue.prototype.$Logger

    console.log('call recipient', recipient)
    // check permission for audio call
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
    } catch (e) {
      throw new Error(WebRTCErrors.PERMISSION_DENIED)
    }

    const id = await iridium.chat?.directConversationId(recipient.did)

    if (id && !(await iridium.chat?.hasConversation(id))) {
      await iridium.chat?.createConversation(recipient.did, 'direct', [
        recipient.did,
        iridium.connector?.id,
      ])
    }

    const conversation = await iridium.chat?.getConversation(id)

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

      const profile = iridium.profile.state

      const peers = participants.map((did) => {
        if (did !== profile.did) {
          const friend = this.iridium.friends.getFriend(did)
          return {
            name: friend.name,
            peerId: friend.peerId,
          }
        }
        return {
          name: profile.name,
          peerId: profile.peerId,
        }
      })

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
    // console.log('call', call)
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
