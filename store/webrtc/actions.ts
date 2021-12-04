import { PublicKey } from '@solana/web3.js'
import Vue from 'vue'
import { WebRTCError, WebRTCState } from './types'
import Crypto from '~/libraries/Crypto/Crypto'

import { ActionsArguments } from '~/types/store/store'
import WebRTC from '~/libraries/WebRTC/WebRTC'

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
      console.log('PEER CONNECTED', peerId)
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
    { commit }: ActionsArguments<WebRTCState>,
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
  },
}
