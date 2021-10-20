import { TextileState } from './types'

const mutations = {
  textileInitialized(state: TextileState, status: boolean) {
    state.initialized = status
  },
}

export default mutations
