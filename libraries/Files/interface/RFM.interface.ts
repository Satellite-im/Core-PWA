// Remote file management
import {
  PersonalBucketIndex,
  SharedBucketIndex,
} from '~/libraries/Files/types/filesystem'

export interface RFM {
  get index(): PersonalBucketIndex | SharedBucketIndex | undefined

  getBucket({ name, encrypted }: { name: string; encrypted?: boolean }): void

  pushFile(file: File, path: string, progressCallback: Function): void

  pullFile(id: string, name: string, size: number): void

  removeFile(name: string): void

  updateIndex(index: PersonalBucketIndex | SharedBucketIndex): void
}
