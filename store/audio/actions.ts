import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'

export default {
  /**
   * @method toggleMute
   * @description Toggles mute for outgoing audio
   * @example @click="toggleMute"
   */
  toggleMute({ state, commit, dispatch, rootState }: any) {
    const muted = !state.muted
    const { activeCall } = rootState.webrtc
    const call = activeCall && $WebRTC.getCall(activeCall.callId)

    commit('setMuted', muted)

    dispatch('sounds/playSound', muted ? Sounds.MUTE : Sounds.UNMUTE, {
      root: true,
    })

    if (call) {
      if (muted) {
        call.mute({ kind: 'audio' })
      } else {
        call.unmute({ kind: 'audio' })
      }
    }
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
