import { BucketState } from './types'

const mutations = {
  bucketInitialized(state: BucketState, status: boolean) {
    state.initialized = status
  },
}

export default mutations
