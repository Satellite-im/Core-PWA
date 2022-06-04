import type { VideoState } from './types'
import { ActionsArguments } from '~/types/store/store'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'

const videoActions = {
  toggleMute(
    { state, commit, dispatch, rootState }: ActionsArguments<VideoState>,
    disabled?: boolean,
  ) {
    disabled = disabled ?? !state.disabled
    const { activeCall } = rootState.webrtc
    const call = activeCall && $WebRTC.getCall(activeCall.callId)

    commit('toggleCamera', disabled)

    dispatch('sounds/playSound', disabled ? Sounds.MUTE : Sounds.UNMUTE, {
      root: true,
    })

    if (!call) {
      return
    }

    if (disabled) {
      call.mute({ kind: 'video' })
      return
    }
    call.unmute({ kind: 'video' })
  },
}

export default videoActions
