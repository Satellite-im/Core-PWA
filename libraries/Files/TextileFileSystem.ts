import Vue from 'vue'
import { PushPathResult } from '@textile/hub'
import skaler from 'skaler'
import { FilSystem } from './FilSystem'
import { FILE_TYPE } from './types/file'
import { Bucket } from './remote/textile/Bucket'
import { isHeic } from '~/utilities/Heic'
import { Config } from '~/config'
const convert = require('heic-convert')

export class TextileFileSystem extends FilSystem {
  /**
   * @getter bucket
   * @returns {Bucket} bucket global to upload files to textile
   */
  get bucket(): Bucket {
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
      file,
      hash: result.path.path,
      size: file.size,
      type: (Object.values(FILE_TYPE) as string[]).includes(file.type)
        ? (file.type as FILE_TYPE)
        : FILE_TYPE.GENERIC,
      thumbnail: await this._createThumbnail(file),
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

  /**
   * @method _createThumbnail
   * @description create thumbnail if embeddable image format
   * @param {File} file
   * @returns {Promise<string>} base64 thumbnail
   */
  private async _createThumbnail(file: File): Promise<string | undefined> {
    // if file is not an embeddable image, set blank thumbnail
    if (
      !file.name.match(Config.regex.image) ||
      file.name.match('^.*.(heic)$')
    ) {
      return
    }
    const buffer = new Uint8Array(await file.arrayBuffer())
    if (isHeic(buffer)) {
      const outputBuffer = await convert({
        buffer,
        format: 'JPEG',
        quality: 1,
      })
      return await this._fileToData(
        await skaler(
          new File([outputBuffer.buffer], file.name, {
            type: 'image/jpeg',
          }),
          { width: 400 },
        ),
      )
    }
    return await this._fileToData(await skaler(file, { width: 400 }))
  }

  /**
   * @method _fileToData
   * @description convert File to base64 string
   * @param {File} file
   * @returns {Promise<string>} base64 thumbnail
   */
  private _fileToData(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result?.toString() || '')
      reader.onerror = (error) => reject(error)
    })
  }
}
