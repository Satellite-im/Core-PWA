import type { VideoState } from './types'
import { ActionsArguments } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'

const videoActions = {
  initialize({ state, commit }: ActionsArguments<VideoState>) {
    commit('setDisabled', true)
    logger.info('store/video/actions.initialize', 'initializing video store')
    if (iridium.id) {
      iridium.webRTC.mute({ did: iridium.id, kind: 'video' })
    }
    iridium.webRTC.on('track', ({ did, kind }) => {
      if (kind === 'video') {
        logger.info(
          'store/video/actions.initialize',
          'initializing video track',
          { did, disabled: state.disabled },
        )
        if (did === iridium.id) {
          iridium.webRTC[state.disabled ? 'mute' : 'unmute']({
            kind: 'video',
            did,
          })
        }
      }
    })
  },
  async toggleMute({ state, commit, rootState }: ActionsArguments<VideoState>) {
    const { activeCall, calls } = iridium.webRTC.state
    const call = activeCall && calls.get(activeCall.callId)
    if (!call) {
      return
    }

    console.info('toggle video mute', state.disabled)
    if (!state.disabled) {
      commit('setDisabled', true)
      await iridium.webRTC.mute({ kind: 'video' })
      return
    }
    commit('setDisabled', false)
    await iridium.webRTC.unmute({ kind: 'video' })
  },
}

export default videoActions
