import type { VideoState } from './types'
import { ActionsArguments } from '~/types/store/store'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'

const videoActions = {
  toggleMute({
    state,
    commit,
    dispatch,
    rootState,
  }: ActionsArguments<VideoState>) {
    const { activeCall } = rootState.webrtc
    const call = activeCall && $WebRTC.getCall(activeCall.callId)
    if (!call) {
      return
    }
    commit('toggleCamera')

    if (!state.disabled) {
      call.unmute({ kind: 'video' })
      return
    }
    call.mute({ kind: 'video' })
  },
}

export default videoActions
