// Remote file management
import { FileSystemErrors } from '../../errors/Errors'
import { Fil } from '../../Fil'
import { RFMInterface } from '../interface/RFM.interface'
import { FilSystem } from '~/libraries/Files/FilSystem'
import { FileSystemExport } from '~/libraries/Files/types/filesystem'

export abstract class RFM implements RFMInterface {
  protected _fileSystem: FilSystem

  constructor(fileSystem: FilSystem) {
    if (this.constructor.name === 'RFM')
      throw new Error(FileSystemErrors.RFM_ABSTRACT_ONLY)

    this._fileSystem = fileSystem
  }

  updateIndex(index: FileSystemExport): void {
    throw new Error(FileSystemErrors.METHOD_MISSING)
  }

  get index(): FileSystemExport {
    throw new Error(FileSystemErrors.METHOD_MISSING)
  }

  delete(file: Fil): boolean {
    throw new Error(FileSystemErrors.METHOD_MISSING)
  }

  upload(file: File, name: string, meta: any): string {
    throw new Error(FileSystemErrors.METHOD_MISSING)
  }
}
