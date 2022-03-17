// Remote file management
import { FileSystemExport } from '~/libraries/Files/types/filesystem'
import { FileSystemErrors } from '../../errors/Errors'
import { Fil } from '../../Fil'
import { RFMInterface } from '../interface/RFM.interface'

export abstract class RFM implements RFMInterface {
  constructor() {
    if (this.constructor.name === 'RFM')
      throw new Error(FileSystemErrors.RFM_ABSTRACT_ONLY)
  }

  updateIndex(index: FileSystemExport): void {
    throw new Error(FileSystemErrors.METHOD_MISSING)
  }

  get index(): FileSystemExport | null {
    throw new Error(FileSystemErrors.METHOD_MISSING)
  }

  delete(file: Fil): boolean {
    throw new Error(FileSystemErrors.METHOD_MISSING)
  }

  upload(file: File, name: string, meta: any): string {
    throw new Error(FileSystemErrors.METHOD_MISSING)
  }
}
