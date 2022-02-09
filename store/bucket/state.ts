import Vue from 'vue'
import { BucketState } from './types'

const InitialBucketState = (): BucketState => ({
  initialized: false,
  fileSystem: Vue.prototype.$Bucket.fileSystem,
})

export default InitialBucketState
