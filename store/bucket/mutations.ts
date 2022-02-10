import { BucketState } from './types'
import { FilSystem } from '~/libraries/Files/FilSystem'

const mutations = {
  bucketInitialized(state: BucketState, status: boolean) {
    state.initialized = status
  },
  updateFileSystem(state: BucketState, fs: FilSystem) {
    state.fileSystem = fs
  },
  openDirectory(state: BucketState, name: string) {
    state.fileSystem.openDirectory(name)
  },
  createDirectory(state: BucketState, name: string) {
    state.fileSystem.createDirectory(name)
  },
  goBackToDirectory(state: BucketState, name: string) {
    state.fileSystem.goBackToDirectory(name)
  },
  createFile(state: BucketState, name: string) {
    state.fileSystem.createFile(name)
  },
}

export default mutations
