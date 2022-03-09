import { PublicKey } from '@solana/web3.js'
import Vue from 'vue'
import { WebRTCError, WebRTCState } from './types'
import Crypto from '~/libraries/Crypto/Crypto'

import { ActionsArguments } from '~/types/store/store'
import WebRTC from '~/libraries/WebRTC/WebRTC'
import Logger from '~/utilities/Logger'

export default {
  /**
   * @method initialized
   * @description Initializes the WebRTC Manager
   * @param originator Address of the current user
   * @example
   * this.$store.dispatch('webrtc/initialize')
   */
  async initialize(
    { commit }: ActionsArguments<WebRTCState>,
    originator: string,
  ) {
    const $WebRTC: WebRTC = Vue.prototype.$WebRTC
    const $Logger: Logger = Vue.prototype.$Logger

    $WebRTC.init(originator)

    $WebRTC.on('PEER_CONNECT', ({ peerId }) => {
      $Logger.log('WebRTC', 'PEER_CONNECT', { peerId })
      commit('setConnectedPeer', peerId)
    })

    $WebRTC.on('ERROR', () => {
      commit('setConnectedPeer', '')
    })

    commit('setInitialized', true)
  },
  /**
   * @method createPeerConnection
   * @description Connects to a secret channel and waits the peer connection to happen
   * @param identifier Address of the current user
   * @example
   * this.$store.dispatch('webrtc/initialize')
   */
  async createPeerConnection(
    { commit, dispatch, state }: ActionsArguments<WebRTCState>,
    identifier: string,
  ) {
    const $WebRTC: WebRTC = Vue.prototype.$WebRTC
    const $Crypto: Crypto = Vue.prototype.$Crypto

    if (!$WebRTC.initialized) {
      throw new Error(WebRTCError.NOT_INITIALIZED)
    }

    const secretChannel = await $Crypto.computeSharedSecret(
      new PublicKey(identifier),
    )

    if (!secretChannel) {
      throw new Error('Unable to compute a secret channel')
    }

    $WebRTC.connect(identifier, secretChannel)

    const peer = $WebRTC.getPeer(identifier)

    peer?.communicationBus.on('TYPING_STATE', ({ state, peerId }) => {
      commit(
        'friends/setTyping',
        { id: peerId, typingState: state },
        { root: true },
      )
      dispatch('subscribeToMailbox')
    })

    peer?.call.on('INCOMING_CALL', (data) => {
      // if incoming call is activer call return before toggling incoming call
      if (state.activeCall === data.peerId) {
        return
      }
      commit('setIncomingCall', data.peerId)
      commit('ui/showMedia', true, { root: true })
    })

    peer?.call.on('OUTGOING_CALL', (data) => {
      commit('setActiveCall', data.peerId)
      commit('ui/showMedia', true, { root: true })
    })

    peer?.call.on('CONNECTED', (data) => {
      commit('setIncomingCall', '')
      commit('setActiveCall', data.peerId)
      commit('updateCreatedAt', Date.now())
    })

    peer?.call.on('HANG_UP', (data) => {
      commit('setIncomingCall', '')
      commit('setActiveCall', '')
      commit('updateCreatedAt', 0)
      commit('updateLocalTracks', {
        audio: {},
        video: {},
      })

      commit('updateRemoteTracks', {
        audio: {},
        video: {},
      })
      commit('ui/showMedia', false, { root: true })
    })

    peer?.call.on('LOCAL_TRACK_CREATED', ({ track }) => {
      const update = { [track.kind]: { id: track.id, muted: !track.enabled } }

      commit('updateLocalTracks', update)

      if (track.kind === 'audio') {
        commit('audio/setMuted', !track.enabled, { root: true })
      }

      if (track.kind === 'video') {
        commit('video/setDisabled', !track.enabled, { root: true })
      }
    })

    peer?.call.on('LOCAL_TRACK_REMOVED', ({ track }) => {
      const update = { [track.kind]: { muted: true } }

      if (track.kind === 'audio') {
        commit('audio/setMuted', true, { root: true })
      }

      if (track.kind === 'video') {
        commit('video/setDisabled', true, { root: true })
      }

      commit('updateLocalTracks', update)
    })

    peer?.call.on('REMOTE_TRACK_RECEIVED', ({ track }) => {
      const update = { [track.kind]: { id: track.id, muted: !track.enabled } }

      commit('updateRemoteTracks', update)
    })

    peer?.call.on('REMOTE_TRACK_REMOVED', ({ track }) => {
      const update = { [track.kind]: { muted: true } }

      commit('updateRemoteTracks', update)
    })
  },
  denyCall({ commit }: ActionsArguments<WebRTCState>) {
    commit('setIncomingCall', '')
  },
  hangUp({ commit }: ActionsArguments<WebRTCState>) {
    commit('setActiveCall', '')
  },
}
