import type { VideoState } from './types'
import { ActionsArguments } from '~/types/store/store'
import { Sounds } from '~/libraries/SoundManager/SoundManager'
import { $WebRTC } from '~/libraries/WebRTC/WebRTC'

const videoActions = {
  toggle(
    { state, commit, dispatch, rootState }: ActionsArguments<VideoState>,
    disabled = !state.disabled,
  ) {
    const { activeCall } = rootState.webrtc
    const call = activeCall && $WebRTC.getCall(activeCall.callId)

    commit('setDisabled', disabled)

    if (disabled) {
      if (call) call.unmute({ kind: 'audio' })
      dispatch('sounds/playSound', Sounds.UNMUTE, { root: true })
      return
    }
    if (call) call.mute({ kind: 'audio' })
    dispatch('sounds/playSound', Sounds.MUTE, { root: true })
  },
}

export default videoActions
