import Vue from 'vue'
import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { WebRTCEnum } from '~/libraries/Enums/types/webrtc'
import WebRTC from '~/libraries/WebRTC/WebRTC'

export default {
  /**
   * @method toggleMute
   * @description Toggles mute for outgoing audio
   * @example @click="toggleMute"
   */
  toggleMute({ dispatch, state, rootState }: any) {
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
    if (!deafened) {
      dispatch('sounds/playSound', Sounds.DEAFEN, { root: true })
      dispatch('sounds/setMuteSounds', true, { root: true })
    } else {
      dispatch('sounds/setMuteSounds', false, { root: true })
      dispatch('sounds/playSound', Sounds.UNDEAFEN, { root: true })
    }
    commit('deafen')
  },
}
