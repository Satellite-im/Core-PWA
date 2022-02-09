import { FilSystem } from '~/libraries/Files/FilSystem'

export interface BucketState {
  initialized: boolean
  fileSystem: FilSystem
}
