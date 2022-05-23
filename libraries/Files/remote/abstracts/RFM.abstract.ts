// Remote file management
import { FileSystemErrors } from '../../errors/Errors'
import { FileSystemExport } from '~/libraries/Files/types/filesystem'

export abstract class RFM {
  constructor() {
    if (this.constructor.name === 'RFM')
      throw new Error(FileSystemErrors.RFM_ABSTRACT_ONLY)
  }

  abstract updateIndex(index: FileSystemExport): void

  abstract get index(): FileSystemExport | undefined

  abstract pullFile(id: string, name: string, size: number): void

  abstract removeFile(name: string): void
}
