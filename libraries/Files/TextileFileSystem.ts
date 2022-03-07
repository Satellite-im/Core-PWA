import { PushPathResult } from '@textile/hub'
import { FilSystem } from './FilSystem'
import { FILE_TYPE } from './types/file'
import { isHeic } from '~/utilities/Heic'
const convert = require('heic-convert')

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
   * @description create thumbnail if embeddable image format, otherwise return ''
   * @param {File} file
   */
  private async _createThumbnail(file: File): Promise<string> {
    const buffer = new Uint8Array(await file.arrayBuffer())
    if (isHeic(buffer)) {
      const outputBuffer = await convert({
        buffer,
        format: 'JPEG',
        quality: 1,
      })
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsArrayBuffer(outputBuffer)
        reader.onload = () => resolve(reader.result?.toString() || '')
        reader.onerror = (error) => reject(error)
      })
    }
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result?.toString() || '')
      reader.onerror = (error) => reject(error)
    })
  }
}
