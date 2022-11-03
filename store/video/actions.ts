import type { VideoState } from './types'
import { ActionsArguments } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'
import { WebRTCEnum } from '~~/libraries/Enums/enums'

const videoActions = {
  initialize({ state, commit }: ActionsArguments<VideoState>) {
    commit('setDisabled', true)
    logger.info('store/video/actions.initialize', 'initializing video store')
    if (iridium.id) {
      iridium.webRTC.mute({ did: iridium.id, kind: WebRTCEnum.VIDEO })
    }
    iridium.webRTC.on('track', ({ did, kind }) => {
      if (kind === WebRTCEnum.VIDEO) {
        logger.info(
          'store/video/actions.initialize',
          'initializing video track',
          { did, disabled: state.disabled },
        )
        if (did === iridium.id) {
          iridium.webRTC[state.disabled ? 'mute' : 'unmute']({
            kind: WebRTCEnum.VIDEO,
            did,
          })
        }
      }
    })
  },
  async toggleMute({ state, commit, rootState }: ActionsArguments<VideoState>) {
    const { activeCall, calls } = iridium.webRTC.state
    const call = activeCall && calls[activeCall.callId]
    if (!call) {
      return
    }

    console.info('toggle video mute', state.disabled)
    if (!state.disabled) {
      commit('setDisabled', true)
      await iridium.webRTC.mute({ kind: WebRTCEnum.VIDEO })
      return
    }
    commit('setDisabled', false)
    await iridium.webRTC.unmute({ kind: WebRTCEnum.VIDEO })
  },
}

export default videoActions
