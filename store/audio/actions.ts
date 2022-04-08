import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'

export default {
  /**
   * @method toggleMute
   * @description Toggles mute for outgoing audio
   * @example @click="toggleMute"
   */
  toggleMute({ dispatch, muted, rootState }: any) {
    const { activeCall } = rootState.webrtc
    const call = $WebRTC.getCall(activeCall.callId)

    if (call) {
      if (muted) {
        call.unmute({ kind: 'audio' })
        dispatch('sounds/playSound', Sounds.UNMUTE, { root: true })
        return
      }
      call.mute({ kind: 'audio' })
      dispatch('sounds/playSound', Sounds.MUTE, { root: true })
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
