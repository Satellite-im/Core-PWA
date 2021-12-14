import { PublicKey } from '@solana/web3.js'
import Vue from 'vue'
import { WebRTCError, WebRTCState } from './types'
import Crypto from '~/libraries/Crypto/Crypto'

import { ActionsArguments } from '~/types/store/store'
import WebRTC from '~/libraries/WebRTC/WebRTC'
import StreamManager from '~/libraries/WebRTC/StreamManager'

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

    $WebRTC.init(originator)

    $WebRTC.on('PEER_CONNECT', ({ peerId }) => {
      Vue.prototype.$Logger.log('WebRTC', 'PEER_CONNECT', { peerId })
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

    if (!$WebRTC.initialized) {
      throw new Error(WebRTCError.NOT_INITIALIZED)
    }

    const $Crypto: Crypto = Vue.prototype.$Crypto

    const secretChannel = await $Crypto.computeSharedSecret(
      new PublicKey(identifier),
    )

    if (!secretChannel) {
      throw new Error('Unable to compute a secret channel')
    }

    $WebRTC.connect(identifier, secretChannel)

    const peer = $WebRTC.getPeer(identifier)

    peer?.communicationBus.on('TYPING_STATE', ({ state, peerId }) => {
      commit('friends/setTyping', { id: peerId, typingState: state }, { root: true })
    })

    peer?.communicationBus.on('RAW_DATA', (message) => {
      if (message.data.type === 'CALL_DENIED') {
        peer?.call.hangUp()
        dispatch('hangUp')
      }
    })

    peer?.call.on('INCOMING_CALL', (data) => {
      // if incoming call is activer call return before toggling incoming call
      if (state.activeCall === data.peerId) {
        return
      }
      commit('webrtc/toggleIncomingCall', data.peerId, { root: true })
    })

    peer?.call.on('HANG_UP', (data) => {
      dispatch('hangUp')
    })

    peer?.call.on('STREAM', (data) => {
      const $StreamManager: StreamManager = Vue.prototype.$StreamManager
      $StreamManager.addLocalStream(data.peerId, data.stream)
      commit('webrtc/setRemoteStream', data.stream, { root: true })
    })

    peer?.call.on('TRACK', (data) => {
    })
  },
  acceptCall({ commit }: ActionsArguments<WebRTCState>, data: Object) {
    commit('toggleIncomingCall', '')
    // @ts-ignore
    commit('setLocalStream', data.stream)
    const $StreamManager: StreamManager = Vue.prototype.$StreamManager
    // @ts-ignore
    $StreamManager.addLocalStream(data.id, data.stream)
    // @ts-ignore
    commit('toggleActiveCall', data.id)
  },
  denyCall({ commit }: ActionsArguments<WebRTCState>) {
    commit('toggleIncomingCall', '')
  },
  makeCall({ commit }: ActionsArguments<WebRTCState>, data: Object) {
    // @ts-ignore
    commit('setLocalStream', data.stream)
    const $StreamManager: StreamManager = Vue.prototype.$StreamManager
    // @ts-ignore
    $StreamManager.addLocalStream(data.id, data.stream)
    // @ts-ignore
    commit('toggleActiveCall', data.id)
  },
  hangUp({ commit }: ActionsArguments<WebRTCState>, data: Object) {
    commit('toggleActiveCall', '')
    const $StreamManager: StreamManager = Vue.prototype.$StreamManager
    $StreamManager.killAllStreams()
    commit('setLocalStream', undefined)
    commit('setRemoteStream', undefined)
  },
}
