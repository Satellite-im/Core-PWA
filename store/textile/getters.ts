import { TextileState } from './types'

const getters = {
  getInitialized: (state: TextileState): boolean => {
    return state.initialized
  },
}

export default getters
