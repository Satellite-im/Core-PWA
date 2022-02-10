import { BucketState } from './types'

const InitialBucketState = (): BucketState => ({
  initialized: false,
  fileSystem: null,
})

export default InitialBucketState
