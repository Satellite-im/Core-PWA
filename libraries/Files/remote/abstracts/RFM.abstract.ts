// Remote file managment

import { RFMInterface } from "../interface/RFM.interface";

export abstract class RFM implements RFMInterface{
  private _fileSystem: FileSystem

  constructor(fileSystem: FileSystem) {
    if (this.constructor.name === 'RFM')
      throw new Error('RFM class is Abstract. It can only be extended')

    this._fileSystem = fileSystem
  }

  upload(file: File, name: string, meta: any): string {
    // Should call addFile on the filesystem
    return ''
  }
}