import type { AudioState } from './types'
import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import { ActionsArguments } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default {
  /**
   * @method toggleMute
   * @description Toggles mute for outgoing audio
   * @example @click="toggleMute"
   */
  async toggleMute({ state, commit, dispatch }: ActionsArguments<AudioState>) {
    const { activeCall } = iridium.webRTC.state
    const call = activeCall && $WebRTC.getCall(activeCall.callId)

    dispatch(
      'sounds/stopSounds',
      [!state.muted ? Sounds.MUTE : Sounds.UNMUTE],
      { root: true },
    )
    dispatch('sounds/playSound', state.muted ? Sounds.MUTE : Sounds.UNMUTE, {
      root: true,
    })

    if (!call) {
      commit('toggleMute')
      return
    }

    if (!state.muted) {
      await call.mute({ kind: 'audio' })
      commit('setMute', true)
      return
    }
    await call.unmute({ kind: 'audio' })
    commit('setMute', false)
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
      dispatch('sounds/playSound', Sounds.UNDEAFEN, { root: true })
      dispatch('sounds/setMuteSounds', false, { root: true })
    }
    commit('deafen')
  },
}
