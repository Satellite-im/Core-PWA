import Vue from 'vue'
import { WebRTCEnum } from '~/libraries/Enums/types/webrtc'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'
import WebRTC from '~/libraries/WebRTC/WebRTC'

const $Sounds = new SoundManager()

export default {
  /**
   * @method toggleMute
   * @description Toggles mute for outgoing audio
   * @example @click="toggleMute"
   */
  toggleMute({ commit, dispatch, state, rootState }: any) {
    const $WebRTC: WebRTC = Vue.prototype.$WebRTC

    const muted = state.muted

    const { activeCall } = rootState.webrtc

    const peer = $WebRTC.getPeer(activeCall)

    if (muted) {
      peer?.call.unmute(WebRTCEnum.AUDIO)
      dispatch('sounds/playSound', Sounds.UNMUTE, { root: true })
      return
    }
    peer?.call.mute(WebRTCEnum.AUDIO)
    dispatch('sounds/playSound', Sounds.MUTE, { root: true })
  },
  /**
   * @method toggleDeafen
   * @description Toggles deafen for incoming audio
   * @example @click="toggleDeafen"
   */
  toggleDeafen({ commit, dispatch, state }: any) {
    const deafened = state.deafened
    if (!deafened) dispatch('sounds/playSound', Sounds.DEAFEN, { root: true })
    else dispatch('sounds/playSound', Sounds.UNDEAFEN, { root: true })
    commit('deafen')
  },
}
