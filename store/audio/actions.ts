import type { AudioState } from './types'
import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { ActionsArguments } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'
import { WebRTCEnum } from '~~/libraries/Enums/enums'

export default {
  initialize({ state, commit }: ActionsArguments<AudioState>) {
    logger.info('store/audio/actions.initialize', 'initializing audio store')
    if (iridium.id) {
      iridium.webRTC.setStreamMuted(iridium.id, {
        audio: state.muted,
      })
    }
    iridium.webRTC.on('track', ({ did, kind }) => {
      if (kind === 'audio') {
        logger.info(
          'store/video/actions.initialize',
          'initializing audio track',
          { did, state },
        )
        if (did === iridium.id) {
          iridium.webRTC[state.muted ? 'mute' : 'unmute']({
            kind: WebRTCEnum.AUDIO,
            did,
          })
        } else {
          iridium.webRTC[state.deafened ? 'mute' : 'unmute']({
            kind: WebRTCEnum.AUDIO,
            did,
          })
        }
      }
    })
  },
  /**
   * @method toggleMute
   * @description Toggles mute for outgoing audio
   * @example @click="toggleMute"
   */
  async toggleMute({ state, commit, dispatch }: ActionsArguments<AudioState>) {
    const { activeCall, calls } = iridium.webRTC.state
    const call = activeCall && calls[activeCall.callId]

    dispatch(
      'sounds/stopSounds',
      [!state.muted ? Sounds.MUTE : Sounds.UNMUTE],
      { root: true },
    )
    dispatch('sounds/playSound', state.muted ? Sounds.MUTE : Sounds.UNMUTE, {
      root: true,
    })

    if (iridium.id) {
      iridium.webRTC.setStreamMuted(iridium.id, {
        audio: !state.muted,
      })
    }

    if (!call) {
      commit('toggleMute')
      return
    }

    console.info('toggle audio mute', state.muted)
    if (!state.muted) {
      commit('setMute', true)
      await iridium.webRTC.mute({ kind: WebRTCEnum.AUDIO, did: iridium.id })
      return
    }
    commit('setMute', false)
    await iridium.webRTC.unmute({ kind: WebRTCEnum.AUDIO })
  },
  /**
   * @method toggleDeafen
   * @description Toggles deafen for incoming audio
   * @example @click="toggleDeafen"
   */
  toggleDeafen({ commit, dispatch, state }: any) {
    const deafened = state.deafened

    dispatch(
      'sounds/stopSounds',
      [deafened ? Sounds.DEAFEN : Sounds.UNDEAFEN],
      { root: true },
    )
    dispatch('sounds/playSound', !deafened ? Sounds.DEAFEN : Sounds.UNDEAFEN, {
      root: true,
    })
    dispatch('sounds/setMuteSounds', !deafened, { root: true })

    commit('deafen')
  },
}
