import { VideoState } from './types'

const mutations = {
  toggleCamera(state: VideoState) {
    state.disabled = !state.disabled
  },
}

export default mutations
