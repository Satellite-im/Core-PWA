import { PushPathResult } from '@textile/hub'
import Vue from 'vue'
import { FilSystem } from './FilSystem'
import { Bucket } from './remote/textile/Bucket'
import { FILE_TYPE } from './types/file'

export class TextileFileSystem extends FilSystem {
  /**
   * @getter bucket
   * @returns {Bucket} bucket global to upload files to textile
   */
  get bucket() {
    return Vue.prototype.$TextileManager.bucket
  }

  /**
   * @method uploadFile
   * @description Upload file to the bucket and create in the file system afterwards
   * @param {File} file file to be uploaded
   */
  async uploadFile(file: File) {
    const result: PushPathResult = await this.bucket.pushFile(file)
    this.createFile({
      name: file.name,
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
