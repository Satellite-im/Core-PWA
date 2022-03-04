import { PushPathResult } from '@textile/hub'
import { FilSystem } from './FilSystem'
import { FILE_TYPE } from './types/file'

export class TextileFileSystem extends FilSystem {
  /**
   * @method uploadFile
   * @description Upload file to the bucket and create in the file system afterwards
   * @param {File} file file to be uploaded
   */
  async uploadFile(file: File) {
    const result: PushPathResult = await this.bucket.pushFile(file)
    this.createFile({
      name: file.name,
      file,
      hash: result.path.path,
      size: file.size,
      type: (Object.values(FILE_TYPE) as string[]).includes(file.type)
        ? (file.type as FILE_TYPE)
        : FILE_TYPE.GENERIC,
    })
  }

  /**
   * @method removeFile
   * @description Remove file/folder from bucket and file system
   * @param {string} name file name
   */
  async removeFile(name: string) {
    await this.bucket.removeFile(name)
  }
}
