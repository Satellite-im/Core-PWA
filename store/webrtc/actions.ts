import Vue from 'vue'
import { PeerId } from 'libp2p/src/metrics'
import { WebRTCState } from './types'

import { ActionsArguments } from '~/types/store/store'
import WebRTC from '~/libraries/WebRTC/WebRTC'
import Logger from '~/utilities/Logger'
import { TrackKind } from '~/libraries/WebRTC/types'
import { Config } from '~/config'
import { PropCommonEnum } from '~/libraries/Enums/enums'
import { initialTracksState } from '~/store/webrtc/state'
import { Peer2Peer, PrivateKeyInfo } from '~/libraries/WebRTC/Libp2p'

let announceInterval
const announceFrequency = 10 * 1000
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
    const $WebRTC: WebRTC = Vue.prototype.$WebRTC
    const $Logger: Logger = Vue.prototype.$Logger

    $WebRTC.init(originator)

    const $Peer2Peer = Peer2Peer.getInstance()
    await $Peer2Peer.init({
      privateKey: privateKeyInfo,
    })
    await $Peer2Peer.start()

    $Peer2Peer.on('peer:connect', ({ peerId }) => {
      const connectedFriend = rootState.friends.all.find(
        (friend) => friend.peerId === peerId.toB58String(),
      )

      if (!connectedFriend || !connectedFriend.peerId) return
      dispatch('createPeerConnection', connectedFriend.address)
    })

    $Peer2Peer.on('peer:disconnect', ({ peerId }) => {
      const disconnectedFriend = rootState.friends.all.find(
        (friend) => friend.peerId === peerId.toB58String(),
      )

      if (!disconnectedFriend) return
      $WebRTC.peers.delete(disconnectedFriend.address)
      commit('removeConnectedPeer', disconnectedFriend.address)
    })

    const timeoutMap: { [key: string]: ReturnType<typeof setTimeout> } = {}
    $Peer2Peer.on(
      'peer:typing',
      ({ peerId, payload }: { peerId: PeerId; payload: any }) => {
        const typingFriend = rootState.friends.all.find(
          (friend) => friend.peerId === peerId.toB58String(),
        )

        if (!typingFriend) return

        commit(
          'friends/setTyping',
          {
            id: typingFriend.address,
            typingState: PropCommonEnum.TYPING,
            typingGroupId: payload.groupId,
          },
          { root: true },
        )

        clearTimeout(timeoutMap[peerId.toB58String()])
        delete timeoutMap[peerId.toB58String()]

        timeoutMap[peerId.toB58String()] = setTimeout(() => {
          commit(
            'friends/setTyping',
            {
              id: typingFriend.address,
              typingState: PropCommonEnum.NOT_TYPING,
              typingGroupId: payload.groupId,
            },
            { root: true },
          )
        }, Config.chat.typingInputThrottle * 3)

        dispatch('textile/subscribeToMailbox', {}, { root: true })
      },
    )

    $Peer2Peer.on('peer:announce', ({ peerId }) => {
      const requestFriend = rootState.friends.all.find(
        (friend) => friend.peerId === peerId.toB58String(),
      )
      if (!requestFriend) return

      if (
        rootState.webrtc.connectedPeers.includes(requestFriend.address) &&
        $WebRTC.peers.has(requestFriend.address)
      )
        return

      dispatch('createPeerConnection', requestFriend.address)
      dispatch('textile/subscribeToMailbox', {}, { root: true })
    })

    announceInterval = setInterval(() => {
      // iterate friends
      rootState.friends.all.forEach((friend) => {
        if (
          friend.peerId &&
          (!$WebRTC.peers.has(friend.address) ||
            !rootState.webrtc.connectedPeers.includes(friend.address))
        ) {
          $Peer2Peer.sendMessage(
            {
              type: 'peer:announce',
              payload: {},
              sentAt: Date.now().valueOf(),
            },
            friend.peerId,
          )
        } else {
          dispatch(
            'friends/setFriendState',
            {
              address: friend.address,
              state: 'online',
            },
            { root: true },
          )
        }
      })
    }, announceFrequency)

    commit('setInitialized', true)
  },
  /**
   * @method getActivePeers
   * @description returns an array of the user id's that have an open/active webrtc call
   * @example
   * this.$store.dispatch('webrtc/getActivePeers') // ['userid1', 'userid2']
   */
  async getActivePeers() {
    const $WebRTC: WebRTC = Vue.prototype.$WebRTC
    return Object.keys($WebRTC.peers)
  },

  /**
   * @method createPeerConnection
   * @description Connects to a secret channel and waits the peer connection to happen
   * @param identifier Address of the current user
   * @example
   * this.$store.dispatch('webrtc/initialize')
   */
  async createPeerConnection(
    { commit, dispatch, state, rootState }: ActionsArguments<WebRTCState>,
    identifier: string,
  ) {
    const $WebRTC: WebRTC = Vue.prototype.$WebRTC

    const activeFriend = rootState.friends.all.find(
      (friend) => friend.address === identifier,
    )

    if (!activeFriend || !activeFriend.peerId) {
      return
    }
    if ($WebRTC.getPeer(activeFriend.peerId)) {
      commit('addConnectedPeer', activeFriend.address)
      dispatch(
        'friends/setFriendState',
        {
          address: activeFriend.address,
          state: 'online',
        },
        { root: true },
      )
      return
    }

    const call = $WebRTC.connect(activeFriend.peerId)
    call.on('INCOMING_CALL', (data) => {
      commit('setIncomingCall', data.peerId)
      commit('ui/showMedia', true, { root: true })
    })

    call.on('OUTGOING_CALL', (data) => {
      commit('setActiveCall', data.peerId)
      commit('ui/showMedia', true, { root: true })
    })

    call.on('CONNECTED', (data) => {
      commit('setIncomingCall', '')
      commit('setActiveCall', data.peerId)
      commit('updateCreatedAt', Date.now())
    })

    call.on('HANG_UP', (data) => {
      commit('setIncomingCall', '')
      commit('setActiveCall', '')
      commit('updateCreatedAt', 0)
      commit('updateLocalTracks', initialTracksState)

      commit('updateRemoteTracks', initialTracksState)
      commit('ui/showMedia', false, { root: true })
    })

    call.on('LOCAL_TRACK_CREATED', ({ track }) => {
      const update = { [track.kind]: { id: track.id, muted: !track.enabled } }
      commit('updateLocalTracks', update)
    })

    call.on('LOCAL_TRACK_REMOVED', ({ track }) => {
      const update = { [track.kind]: { muted: true } }
      commit('updateLocalTracks', update)
    })

    call.on('REMOTE_TRACK_RECEIVED', ({ track }) => {
      const update = { [track.kind]: { id: track.id, muted: !track.enabled } }
      commit('updateRemoteTracks', update)
    })

    call.on('REMOTE_TRACK_REMOVED', ({ track }) => {
      const update = { [track.kind]: { muted: true } }
      commit('updateRemoteTracks', update)
    })

    dispatch(
      'friends/setFriendState',
      {
        address: activeFriend.address,
        state: 'online',
      },
      { root: true },
    )
    commit('addConnectedPeer', activeFriend.address)
  },
  denyCall({ commit }: ActionsArguments<WebRTCState>) {
    commit('setIncomingCall', '')
  },
  hangUp({ commit }: ActionsArguments<WebRTCState>) {
    commit('setActiveCall', '')
  },
  async call(
    { commit, state, dispatch, rootState }: ActionsArguments<WebRTCState>,
    kinds: TrackKind[],
  ) {
    if (!state.connectedPeers) return

    const $WebRTC: WebRTC = Vue.prototype.$WebRTC
    const $Hounddog = Vue.prototype.$Hounddog

    const activeFriend = $Hounddog.getActiveFriend(rootState.friends)

    if (!activeFriend) return

    const identifier = activeFriend.address

    // Trying to call the same user while call is already active
    if (identifier === state.activeCall) return

    if (!$WebRTC.peers.has(identifier)) {
      await dispatch('createPeerConnection', identifier)
    }

    const call = $WebRTC.getPeer(activeFriend.peerId)
    if (!call) {
      return
    }
    try {
      await call.createLocalTracks(kinds)
      await call.start()
    } catch (error) {
      if (error instanceof Error) {
        // @ts-ignore
        this.app.$toast.error(this.app.i18n.t(error.message) as string)
      }
    }
  },
}

export default webRTCActions
