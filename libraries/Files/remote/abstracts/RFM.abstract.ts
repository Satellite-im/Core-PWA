// Remote file management
import { Item } from "../../abstracts/Item.abstract"
import { FileSystemErrors } from "../../errors/Errors"
import { Fil } from "../../Fil"
import { RFMInterface } from "../interface/RFM.interface"

export abstract class RFM implements RFMInterface{
  private _fileSystem: FileSystem

  constructor(fileSystem: FileSystem) {
    if (this.constructor.name === 'RFM')
      throw new Error(FileSystemErrors.RFM_ABSTRACT_ONLY)

    this._fileSystem = fileSystem
  }
  updateIndex(index: FileSystem): void {
    throw new Error(FileSystemErrors.METHOD_MISSING)
  }
  getIndex(): Promise<Item[]> {
    throw new Error(FileSystemErrors.METHOD_MISSING)
  }
  delete(file: Fil): boolean {
    throw new Error(FileSystemErrors.METHOD_MISSING)
  }

  upload(file: File, name: string, meta: any): string {
    throw new Error(FileSystemErrors.METHOD_MISSING)
  }
}