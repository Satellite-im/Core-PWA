import type { SignalData } from 'simple-peer'
import Vue from 'vue'
import {
  ConversationActivity,
  ConversationParticipant,
} from '../conversation/types'
import { WebRTCState } from './types'
import { Config } from '~/config'
import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { CallPeerDescriptor } from '~/libraries/WebRTC/Call'
import { Peer2Peer, PrivateKeyInfo } from '~/libraries/WebRTC/Libp2p'
import { TrackKind } from '~/libraries/WebRTC/types'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import { ActionsArguments } from '~/types/store/store'
import { Friend } from '~/types/ui/friends'
import Logger from '~/utilities/Logger'

const announceFrequency = 5000

const webRTCActions = {
  /**
   * @method initialized
   * @description Initializes the WebRTC Manager
   * @param originator Address of the current user
   * @example
   * this.$store.dispatch('webrtc/initialize')
   */
  async initialize(
    { commit, rootState, dispatch }: ActionsArguments<WebRTCState>,
    {
      privateKeyInfo,
      originator,
    }: { privateKeyInfo: PrivateKeyInfo; originator: string },
  ) {
    commit('setIncomingCall', undefined)
    commit('setActiveCall', undefined)
    commit('conversation/setCalling', false, { root: true })

    $WebRTC.init(originator)

    const $Peer2Peer = Peer2Peer.getInstance()
    await $Peer2Peer.init({
      privateKey: privateKeyInfo,
    })
    await $Peer2Peer.start()
    await $Peer2Peer.node?.relay?.start()

    $Peer2Peer.on('peer:discovery', ({ peerId }) => {
      const connectedFriend = rootState.friends.all.find(
        (friend) => friend.peerId === peerId.toB58String(),
      )

      if (!connectedFriend) return

      dispatch(
        'friends/setFriendState',
        {
          address: connectedFriend.address,
          state: 'online',
        },
        { root: true },
      )
      dispatch('textile/subscribeToMailbox', {}, { root: true })
    })

    $Peer2Peer.on('peer:connect', ({ peerId }) => {
      const connectedParticipant = rootState.conversation.participants.find(
        (participant: ConversationParticipant) =>
          participant.peerId === peerId.toB58String(),
      )
      if (connectedParticipant) {
        commit(
          'conversation/updateParticipant',
          {
            peerId: connectedParticipant.peerId,
            state: 'CONNECTED',
          },
          { root: true },
        )
      }
      const connectedFriend = rootState.friends.all.find(
        (friend) => friend.peerId === peerId.toB58String(),
      )
      if (!connectedFriend) return
      dispatch(
        'friends/setFriendState',
        {
          address: connectedFriend.address,
          state: 'online',
        },
        { root: true },
      )
      dispatch('textile/subscribeToMailbox', {}, { root: true })
    })

    $Peer2Peer.on('peer:call', async ({ payload, peerId }) => {
      // update conversation participants with peers from call announcement
      if (payload.peers) {
        payload.peers.forEach((peer) => {
          if (
            rootState.conversation.participants.find(
              (p) => p.peerId === peer.id,
            )
          ) {
            commit(
              'conversation/updateParticipant',
              {
                peerId: peer.id,
                name: peer.name,
              },
              { root: true },
            )
          }
        })
      }

      if (!payload.callId || payload.callId === $Peer2Peer.id) {
        return
      }

      const call = $WebRTC.getCall(payload.callId)
      if (!call) {
        dispatch('createCall', payload)
        return
      }

      if (rootState.webrtc.activeCall?.callId !== call.callId) {
        return
      }

      const peerIdStr = peerId.toB58String()
      if (
        !call.peerConnected[peerIdStr] &&
        !call.peerDialingDisabled[peerIdStr]
      ) {
        await call.initiateCall(peerIdStr)
      }
    })

    $Peer2Peer.on('peer:disconnect', ({ peerId }) => {
      const disconnectedParticipant = rootState.conversation.participants.find(
        (participant: ConversationParticipant) =>
          participant.peerId === peerId.toB58String(),
      )
      if (disconnectedParticipant) {
        commit(
          'conversation/updateParticipant',
          {
            peerId: disconnectedParticipant.peerId,
            state: 'DISCONNECTED',
          },
          { root: true },
        )
      }

      const disconnectedFriend = rootState.friends.all.find(
        (friend) => friend.peerId === peerId.toB58String(),
      )
      if (disconnectedFriend) {
        dispatch(
          'friends/setFriendState',
          {
            address: disconnectedFriend.address,
            state: 'offline',
          },
          { root: true },
        )
      }

      const peerHash = peerId.toB58String()
      $WebRTC.calls.forEach((call) => {
        if (call.peers[peerHash]) {
          call.destroyPeer(peerHash)
          delete call.peers[peerHash]
        }
      })
    })

    const timeoutMap: { [key: string]: ReturnType<typeof setTimeout> } = {}
    $Peer2Peer.on('peer:typing', ({ peerId }) => {
      commit(
        'conversation/updateParticipant',
        {
          peerId: peerId.toB58String(),
          activity: ConversationActivity.TYPING,
        },
        { root: true },
      )

      clearTimeout(timeoutMap[peerId.toB58String()])
      delete timeoutMap[peerId.toB58String()]

      timeoutMap[peerId.toB58String()] = setTimeout(() => {
        commit(
          'conversation/updateParticipant',
          {
            peerId: peerId.toB58String(),
            activity: ConversationActivity.NOT_TYPING,
          },
          { root: true },
        )
      }, Config.chat.typingInputThrottle * 3)

      dispatch('textile/subscribeToMailbox', {}, { root: true })
    })

    $Peer2Peer.on('peer:announce', ({ peerId, payload }) => {
      const requestParticipant = rootState.conversation.participants.find(
        (p) =>
          p.peerId === peerId.toB58String() ||
          (payload.address && p.address === payload.address),
      )
      if (requestParticipant) {
        commit(
          'conversation/updateParticipant',
          {
            peerId: requestParticipant.peerId,
            state: 'CONNECTED',
            name: payload.name,
            profilePicture: payload.profilePicture,
          },
          { root: true },
        )
      }
      const requestFriend = rootState.friends.all.find(
        (friend) => friend.peerId === peerId.toB58String(),
      )
      if (!requestFriend || requestFriend.state === 'online') return
      dispatch(
        'friends/setFriendState',
        {
          address: requestFriend.address,
          state: 'online',
        },
        { root: true },
      )
      dispatch('textile/subscribeToMailbox', {}, { root: true })
    })

    $Peer2Peer.on(
      'peer:mute',
      ({ peerId, payload: { callId, trackId, kind } }) => {
        const peerIdStr = peerId.toB58String()
        commit('setMuted', {
          peerId: peerIdStr,
          kind,
          callId,
          trackId,
          muted: true,
        })
      },
    )

    $Peer2Peer.on(
      'peer:unmute',
      ({ peerId, payload: { callId, trackId, kind } }) => {
        const peerIdStr = peerId.toB58String()
        commit('setMuted', {
          peerId: peerIdStr,
          kind,
          callId,
          trackId,
          muted: false,
        })
      },
    )

    setInterval(() => {
      if (rootState.conversation) {
        rootState.conversation.participants
          .filter((p) => p.peerId && p.peerId !== $Peer2Peer.id)
          .forEach((p) => {
            $Peer2Peer.sendMessage(
              {
                type: 'peer:announce',
                payload: {
                  name: rootState.accounts.details?.name,
                  address: rootState.accounts.details?.address,
                  profilePicture: rootState.accounts.details?.profilePicture,
                },
                sentAt: Date.now().valueOf(),
              },
              p.peerId as string,
            )
          })
      }
      rootState.friends.all
        .filter((friend) => !!friend.peerId)
        .forEach((friend) => {
          $Peer2Peer.sendMessage(
            {
              type: 'peer:announce',
              payload: {
                name: rootState.accounts.details?.name,
                address: rootState.accounts.details?.address,
                profilePicture: rootState.accounts.details?.profilePicture,
              },
              sentAt: Date.now().valueOf(),
            },
            friend.peerId as string,
          )
        })
    }, announceFrequency)

    commit('setInitialized', { initialized: true, originator })
  },
  /**
   * @method sendTyping
   * @description - send the TYPING event to the other conversation participants
   */
  sendTyping({ commit, rootState, dispatch }: ActionsArguments<WebRTCState>) {
    const $Peer2Peer = Peer2Peer.getInstance()

    rootState.conversation?.participants
      .filter((p) => p.peerId && p.peerId !== $Peer2Peer.id)
      .forEach((p) => {
        $Peer2Peer.sendMessage(
          {
            type: 'TYPING_STATE',
            payload: null,
            sentAt: Date.now().valueOf(),
          },
          p.peerId as string,
        )
      })
  },
  /**
   * @method toggleMute
   * @description - Turn on/off mute for the given stream in the active call
   * @param peerId Peer ID of the owner of the stream
   * @param kind Kind of the stream (audio/video/screen)
   */
  async toggleMute(
    { state, dispatch, commit }: ActionsArguments<WebRTCState>,
    { peerId, kind }: { peerId: string; kind: 'audio' | 'video' | 'screen' },
  ) {
    if (!state.activeCall || !peerId) {
      return
    }
    const call = $WebRTC.getCall(state.activeCall.callId)
    if (!call) {
      return
    }
    const isMuted = state.streamMuted[peerId]?.[kind]
    if (isMuted) {
      await call.unmute({ peerId, kind })
      dispatch('sounds/playSound', Sounds.UNMUTE, { root: true })
      return
    }
    await call.mute({ peerId, kind })
    dispatch('sounds/playSound', Sounds.MUTE, { root: true })
  },

  /**
   * @method getActiveCalls
   * @description returns an array containing the callId for each active webrtc call
   * @example
   * this.$store.dispatch('webrtc/getActiveCalls') // ['userid1', 'groupId2']
   */
  async getActiveCalls() {
    return Object.keys($WebRTC.calls)
  },

  /**
   * @method createCall
   * @description creates a webrtc call connection to the provided peer(s)
   * @param callID - the identifier of the group or peer
   * @param peerIds - an array of peerIds that are part of the call
   * @param signal - a pre-provided peer signal for dropping into ongoing calls (optional)
   * @param peerId - the peerId of the user that initiated the call
   * @example
   * this.$store.dispatch('webrtc/initialize', { callId: 'userid1', peerId: 'userid2' })
   * this.$store.dispatch('webrtc/initialize', { callId: 'groupId1', peerIds: ['userid1', 'userid2'] })
   */
  async createCall(
    { commit, state, rootState, dispatch }: ActionsArguments<WebRTCState>,
    {
      callId,
      peerIds,
      peers,
      signal,
      peerId,
    }: {
      callId: string
      peerIds?: string[]
      peers?: CallPeerDescriptor[]
      signal?: SignalData
      peerId?: string
    },
  ) {
    const $Logger: Logger = Vue.prototype.$Logger
    const $Peer2Peer: Peer2Peer = Peer2Peer.getInstance()

    $Logger.log('webrtc: creating call', callId + ' ' + peerIds)

    if (!$WebRTC.initialized && state.originator) {
      $WebRTC.init(state.originator)
    }

    const friendToPeerDescriptor = (
      friend: Friend | ConversationParticipant,
    ) => ({
      id: friend.peerId || '',
      name: friend.name,
    })

    if (!peers) {
      peers = (
        peerIds
          ? (rootState.conversation.participants.filter((participant) => {
              return participant.peerId && peerIds.includes(participant.peerId)
            }) as ConversationParticipant[])
          : ([
              rootState.friends.all.find((friend) => friend.peerId === callId),
            ] as Friend[])
      )
        .map((friend: Friend | ConversationParticipant) =>
          friendToPeerDescriptor(friend),
        )
        .concat({
          id: $Peer2Peer.id as string,
          name: rootState.accounts.details?.name as string,
        })
    }

    const localId: string = $Peer2Peer.id as string
    const usedCallId = callId === localId ? peerId : callId
    if (!usedCallId) {
      throw new Error('webrtc: invalid callId provided: ' + callId)
    }
    const call = $WebRTC.connect(
      usedCallId,
      peers,
      signal && peerId ? { [peerId]: signal } : {},
    )

    if (!call) {
      $Logger.log('webrtc/createCall', 'call invalid')
      return
    }

    function onCallIncoming({ peerId }: { peerId: string }) {
      call.peerDialingDisabled[peerId] = true
      if (state.activeCall?.callId === call.callId) {
        call.answer(peerId)
        return
      }
      if (state.activeCall?.callId) {
        return
      }
      if (
        state.incomingCall === undefined &&
        (!call.active || state.activeCall?.callId !== call.callId)
      ) {
        const type = call.callId?.indexOf('|') > -1 ? 'group' : 'friend'
        $Logger.log(
          'webrtc/incomingCall',
          `incoming call #${call.callId} (${type})`,
        )
        commit('setIncomingCall', {
          callId: call.callId,
          peerId,
          type,
        })
      }
      dispatch('sounds/playSound', Sounds.CALL, { root: true })
    }
    call.on('INCOMING_CALL', onCallIncoming)

    function onCallOutgoing({ peerId }: { peerId: string }) {
      commit('setIncomingCall', undefined)
      commit('setActiveCall', { callId, peerId })
      dispatch('sounds/playSound', Sounds.CALL, { root: true })
    }
    call.on('OUTGOING_CALL', onCallOutgoing)

    function onCallConnected({ peerId }: { peerId: string }) {
      commit('setIncomingCall', undefined)
      commit('setActiveCall', { callId, peerId })
      commit('conversation/setCalling', true, { root: true })
      commit('updateCreatedAt', Date.now())
      if (rootState.audio.muted) {
        call.mute({ peerId: localId, kind: 'audio' })
      }
      commit('video/setDisabled', true, { root: true })
      dispatch('sounds/stopSound', Sounds.CALL, { root: true })
    }
    call.on('CONNECTED', onCallConnected)

    function onCallHangup() {
      commit('updateCreatedAt', 0)
      commit('conversation/setCalling', false, { root: true })
      commit('setIncomingCall', undefined)
      commit('setActiveCall', undefined)
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
      if (!kind) {
        return
      }
      commit('setMuted', {
        peerId: $Peer2Peer.id,
        kind,
        muted: false,
      })
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
      commit('setMuted', {
        peerId,
        kind,
        muted: false,
      })
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
      commit('setMuted', {
        peerId,
        kind,
        muted: false,
      })
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
      commit('setMuted', {
        peerId,
        kind,
        muted: true,
      })
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
      commit('setMuted', {
        peerId: $Peer2Peer.id,
        kind,
        muted: true,
      })
    }
    call.on('LOCAL_TRACK_REMOVED', onLocalTrackRemoved)

    function onStream({ peerId, kind }: { peerId: string; kind?: string }) {
      commit('setMuted', { peerId, kind, muted: false })
    }
    call.on('STREAM', onStream)

    function onAnswered({ peerId }: { peerId: string }) {
      commit('setIncomingCall', undefined)
      commit('setActiveCall', { callId, peerId })
    }
    call.on('ANSWERED', onAnswered)

    function onCallDestroy() {
      if (rootState.webrtc.incomingCall !== undefined) {
        const callerInfo = rootState.friends.all.find((friend) => {
          return friend.account.from === state.originator
        })
        console.log(callerInfo)
        dispatch(
          'ui/sendNotification',
          {
            message: 'Missed Call',
            from: callerInfo?.name,
            fromAddress: callerInfo?.address,
            imageHash: callerInfo?.photoHash,
            title: `Notification`,
            type: AlertType.MISSED_CALL,
          },
          { root: true },
        )
      }
      commit('setIncomingCall', undefined)
      commit('setActiveCall', undefined)
      commit('updateCreatedAt', 0)
      commit('conversation/setCalling', false, { root: true })
      commit('ui/fullscreen', false, { root: true })
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
      dispatch('sounds/stopSound', Sounds.CALL, { root: true })
      dispatch('sounds/playSound', Sounds.HANGUP, { root: true })
    }
    call.on('DESTROY', onCallDestroy)
  },
  /**
   * @method deny
   * @description denies an incoming call
   * @example
   * this.$store.dispatch('webrtc/deny')
   */
  denyCall({ state }: ActionsArguments<WebRTCState>) {
    if (state.activeCall) $WebRTC.getCall(state.activeCall.callId)?.destroy()
    if (state.incomingCall) {
      $WebRTC.getCall(state.incomingCall.callId)?.destroy()
    }
  },
  /**
   * @method hangUp
   * @description hangs up the active call
   * @example
   * this.$store.dispatch('webrtc/hangUp')
   */
  hangUp({ state, commit }: ActionsArguments<WebRTCState>) {
    if (state.activeCall) {
      $WebRTC.getCall(state.activeCall.callId)?.destroy()
    }
    commit('setActiveCall', undefined)
    commit('setIncomingCall', undefined)
  },
  /**
   * @method call
   * @description dials an outbound call to the active peer(s) (rootState.conversation.id)
   * @param kinds - an array of media kinds to be sent (audio, video, screen)
   * @example
   * this.$store.dispatch('webrtc/call')
   */
  async call(
    { dispatch, commit, rootState }: ActionsArguments<WebRTCState>,
    { kinds }: { kinds: TrackKind[] },
  ) {
    const $Logger: Logger = Vue.prototype.$Logger
    const $Peer2Peer: Peer2Peer = Peer2Peer.getInstance()

    const activeConversation = rootState.conversation
    if (!activeConversation.id) {
      $Logger.log(
        'webrtc',
        `call - conversation not initialized or id not found`,
      )
      return
    }

    const peerIds = activeConversation.participants
      .map((p) => p.peerId)
      .filter(Boolean)
    if (peerIds.length === 0) {
      $Logger.log('webrtc', `call - conversation has no participants`)
      return
    }

    const callId = activeConversation.id
    if (!callId) {
      $Logger.log('webrtc', `call - callId not found: ${callId}`)
      return
    }

    if (!$WebRTC.calls.has(callId)) {
      $Logger.log('webrtc', `call - call not found: ${callId}, creating...`)
      await dispatch('createCall', {
        callId,
        peerIds,
        initiate: true,
      })
    }

    const call = $WebRTC.getCall(callId)
    if (!call) {
      $Logger.log('webrtc', `call - call not ready: ${callId}`)
      return
    }

    commit('setStreamMuted', {
      peerId: $Peer2Peer.id,
      audio: !kinds.includes('audio'),
      video: !kinds.includes('video'),
      screen: !kinds.includes('screen'),
    })

    commit('setIncomingCall', undefined)
    commit('setActiveCall', { callId })
    await call.createLocalTracks(kinds)
    await call.start()
  },
}

export default webRTCActions
