import { VideoState } from './types'

const mutations = {
  toggleCamera(state: VideoState) {
    state.disabled = !state.disabled
  },
  setDisabled(state: VideoState, disabled: boolean) {
    state.disabled = disabled
  },
}

export default mutations
