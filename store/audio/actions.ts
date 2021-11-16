import { AudioState } from './types'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'

const $Sounds = new SoundManager()

export default {
  /**
   * @method toggleMute
   * @description Toggles mute for outgoing audio
   * @example @click="toggleMute"
   */
  toggleMute({ commit, state }: any) {
    const muted = state.muted
    if (!muted) $Sounds.playSound(Sounds.MUTE)
    else $Sounds.playSound(Sounds.UNMUTE)
    commit('mute')
  },
  /**
   * @method toggleDeafen
   * @description Toggles deafen for incoming audio
   * @example @click="toggleDeafen"
   */
  toggleDeafen({ commit, state }: any) {
    const deafened = state.deafened
    if (!deafened) $Sounds.playSound(Sounds.DEAFEN)
    else $Sounds.playSound(Sounds.UNDEAFEN)
    commit('deafen')
  },
}
