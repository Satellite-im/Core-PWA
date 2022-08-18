import type { VideoState } from './types'
import { ActionsArguments } from '~/types/store/store'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'
import iridium from '~/libraries/Iridium/IridiumManager'

const videoActions = {
  async toggleMute({ state, commit, rootState }: ActionsArguments<VideoState>) {
    const { activeCall } = iridium.webRTC.state
    const call = activeCall && $WebRTC.getCall(activeCall.callId)
    if (!call) {
      return
    }

    if (!state.disabled) {
      await call.mute({ kind: 'video' })
      commit('setDisabled', true)
      return
    }
    await call.unmute({ kind: 'video' })
    commit('setDisabled', false)
  },
}

export default videoActions
