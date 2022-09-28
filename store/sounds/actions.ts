import { SoundsState } from './types'
import SoundManager, { Sounds } from '~/libraries/SoundManager/SoundManager'
import { ActionsArguments } from '~/types/store/store'

const $Sounds = new SoundManager()

export default {
  /**
   * @method playSound
   * @description play sound with its type
   * @example playSound(Sounds.CALL)
   */
  playSound({ state }: ActionsArguments<SoundsState>, call: Sounds) {
    const status = state[call]
    if (status) $Sounds.playSound(call)
  },
  /**
   * @method stopSounds
   * @description stops the specified sounds
   * @param soundList sounds list to stop
   */
  stopSounds(
    { state }: ActionsArguments<SoundsState>,
    soundList: Array<Sounds>,
  ) {
    if (soundList.length) $Sounds.stopSounds(soundList)
  },
  /**
   * @method playingSounds
   * @description detects which sound is played
   * @return returns an array with the sounds that are currently playing
   */
  playingSounds({ state }: ActionsArguments<SoundsState>) {
    return $Sounds.playingSounds()
  },
  setMuteSounds({ state }: ActionsArguments<SoundsState>, flag: boolean) {
    $Sounds.setMuteSounds(flag)
  },
}
