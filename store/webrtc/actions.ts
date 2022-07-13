import type { SignalData } from 'simple-peer'
import Vue from 'vue'
import {
  ConversationActivity,
  ConversationParticipant,
} from '../conversation/types'
import { WebRTCState } from './types'

import { Config } from '~/config'
import iridium from '~/libraries/Iridium/IridiumManager'
import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { CallPeerDescriptor } from '~/libraries/WebRTC/Call'
import { TrackKind } from '~/libraries/WebRTC/types'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import { ActionsArguments } from '~/types/store/store'
import { Friend } from '~/types/ui/friends'
import Logger from '~/utilities/Logger'
import { WebRTCErrors } from '~/libraries/WebRTC/errors/Errors'

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
    { originator }: { originator: string },
  ) {
    commit('setIncomingCall', undefined)
    commit('setActiveCall', undefined)
    commit('conversation/setCalling', false, { root: true })
    iridium.connector.on('peer:discovery', ({ peerId }: { peerId: string }) => {
      const $Logger: Logger = Vue.prototype.$Logger
      const loggerPrefix = 'webrtc/peer:discovery - '

      const connectedFriend = rootState.friends.all.find(
        (friend) => friend.peerId === peerId.toB58String(),
      )

      if (!connectedFriend) return

      $Logger.log(loggerPrefix, `discovered peer: ${peerId.toB58String()}`)
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

    iridium.connector.on(
      'peer:connect',
      ({ peerId, did }: { peerId: string; did: string }) => {
        const $Logger: Logger = Vue.prototype.$Logger
        const loggerPrefix = 'webrtc/peer:connect - '
        const connectedParticipant = rootState.conversation.participants.find(
          (participant: ConversationParticipant) =>
            participant.peerId === peerId.toB58String(),
        )
        if (connectedParticipant) {
          $Logger.log(
            loggerPrefix,
            `connected participant: ${peerId.toB58String()}`,
          )
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
        $Logger.log(loggerPrefix, `connected friend: ${peerId.toB58String()}`)
        dispatch(
          'friends/setFriendState',
          {
            address: connectedFriend.address,
            state: 'online',
          },
          { root: true },
        )
        dispatch('textile/subscribeToMailbox', {}, { root: true })
      },
    )

    iridium.connector.on(
      'peer:call',
      async ({
        peerId,
        did,
        payload,
      }: {
        peerId: string
        did: string
        payload: any
      }) => {
        // update conversation participants with peers from call announcement
        const $Logger: Logger = Vue.prototype.$Logger
        const loggerPrefix = 'webrtc/peer:call - '
        $Logger.log(
          loggerPrefix,
          `incoming call with callId: ${payload.callId}`,
        )

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

        if (!payload.callId || payload.callId === did) {
          $Logger.log(loggerPrefix, `invalid callId`)
          return
        }

        const call = $WebRTC.getCall(payload.callId)
        if (!call) {
          $Logger.log(loggerPrefix, `create a call...`)
          dispatch('createCall', payload)
          return
        }

        if (rootState.webrtc.activeCall?.callId !== call.callId) {
          $Logger.log(
            loggerPrefix,
            `No active call with call id: ${call.callId}`,
          )
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
      },
    )

    iridium.connector.on(
      'peer:disconnect',
      ({ peerId, did }: { peerId: string; did: string }) => {
        const $Logger: Logger = Vue.prototype.$Logger
        const loggerPrefix = 'webrtc/peer:disconnect - '

        const disconnectedParticipant =
          rootState.conversation.participants.find(
            (participant: ConversationParticipant) =>
              participant.peerId === peerId.toB58String(),
          )
        if (disconnectedParticipant) {
          $Logger.log(loggerPrefix, 'disconnected participant: ', {
            peerId: peerId.toB58String(),
          })
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
          $Logger.log(loggerPrefix, 'disconnected friend: ', {
            peerId: peerId.toB58String(),
          })
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
      },
    )

    const timeoutMap: { [key: string]: ReturnType<typeof setTimeout> } = {}
    iridium.connector?.on('peer:typing', ({ peerId }: { peerId: string }) => {
      commit(
        'conversation/updateParticipant',
        {
          peerId: peerId.toB58String(),
          activity: ConversationActivity.TYPING,
        },
        { root: true },
      )

      clearTimeout(timeoutMap[peerId])
      delete timeoutMap[peerId]

      timeoutMap[peerId] = setTimeout(() => {
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

    iridium.connector?.on(
      'peer:announce',
      ({ peerId, payload }: { peerId: string; payload: any }) => {
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
      },
    )

    iridium.connector?.on(
      'peer:mute',
      ({
        peerId,
        payload: { callId, trackId, kind },
      }: {
        peerId: string
        payload: any
      }) => {
        const peerIdStr = peerId.toB58String()
        commit('setMuted', {
          peerId,
          kind,
          callId,
          trackId,
          muted: true,
        })
      },
    )

    iridium.connector?.on(
      'peer:unmute',
      ({
        peerId,
        payload: { callId, trackId, kind },
      }: {
        peerId: string
        payload: any
      }) => {
        const peerIdStr = peerId.toB58String()
        commit('setMuted', {
          peerId,
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
          .filter((p) => p.peerId && p.peerId !== iridium.connector?.peerId)
          .forEach((p) => {
            iridium.connector.send(
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
        .filter((friend) => !!friend.peerId && friend.state !== 'online')
        .forEach((friend) => {
          iridium.connector?.sendMessage(
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
   * @param callId - the identifier of the group or peer
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
          id: iridium.connector?.peerId as string,
          name: rootState.accounts.details?.name as string,
        })
    }

    const usedCallId = callId === iridium.connector?.peerId ? peerId : callId
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
      commit('ui/showMedia', true, { root: true })
    }
    call.on('INCOMING_CALL', onCallIncoming)

    function onCallOutgoing({ peerId }: { peerId: string }) {
      commit('setIncomingCall', undefined)
      commit('setActiveCall', { callId, peerId })
      commit('ui/showMedia', true, { root: true })
    }
    call.on('OUTGOING_CALL', onCallOutgoing)

    function onCallConnected({ peerId }: { peerId: string }) {
      commit('setIncomingCall', undefined)
      commit('setActiveCall', { callId, peerId })
      commit('conversation/setCalling', true, { root: true })
      commit('updateCreatedAt', Date.now())
      if (rootState.audio.muted) {
        call.mute({ peerId: iridium.connector?.peerId, kind: 'audio' })
      }
      commit('video/setDisabled', true, { root: true })
    }
    call.on('CONNECTED', onCallConnected)

    function onCallHangup() {
      commit('updateCreatedAt', 0)
      commit('ui/showMedia', false, { root: true })
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
      let muted: Boolean = true
      if (kind === 'audio') {
        muted = rootState.audio.muted
      } else if (kind === 'video') {
        muted = rootState.video.disabled
      }
      commit('setMuted', {
        peerId: iridium.connector?.peerId,
        kind,
        muted: !muted,
      })
      if (rootState.audio.muted) {
        call.mute({ peerId: iridium.connector?.peerId, kind: 'audio' })
      }
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
      if (rootState.audio.muted) {
        call.mute({ peerId: iridium.connector?.peerId, kind: 'audio' })
      }
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
      commit('setMuted', {
        peerId,
        kind,
        muted: true,
      })
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
        peerId: iridium.connector?.peerId,
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

    // check permission for audio call
    try {
      await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
    } catch (e) {
      throw new Error(WebRTCErrors.PERMISSION_DENIED)
    }

    const { id: callId, participants } = rootState.conversation

    if (!callId) {
      $Logger.log(
        'webrtc',
        `call - conversation not initialized or id not found`,
      )
      return
    }

    const peerIds = participants.map((p) => p.peerId).filter(Boolean)

    if (peerIds.length === 0) {
      $Logger.log('webrtc', `call - conversation has no participants`)
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
      peerId: iridium.connector?.peerId,
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
