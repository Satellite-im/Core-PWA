import { WebRTCState } from './types'

const mutations = {
  setInitialized(state: WebRTCState, initialized: boolean) {
    state.initialized = initialized
  },
}

export default mutations
