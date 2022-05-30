// Remote file management
import { FileSystemErrors } from '../../errors/Errors'
import {
  PrivateBucketIndex,
  SharedBucketIndex,
} from '~/libraries/Files/types/filesystem'

export abstract class RFM {
  constructor() {
    if (this.constructor.name === 'RFM')
      throw new Error(FileSystemErrors.RFM_ABSTRACT_ONLY)
  }

  abstract get index(): PrivateBucketIndex | SharedBucketIndex | undefined

  abstract getBucket({
    name,
    encrypted,
  }: {
    name: string
    encrypted: boolean
  }): void

  abstract pushFile(file: File, path: string, progressCallback: Function): void

  abstract pullFile(id: string, name: string, size: number): void

  abstract removeFile(name: string): void

  abstract updateIndex(index: PrivateBucketIndex | SharedBucketIndex): void
}
