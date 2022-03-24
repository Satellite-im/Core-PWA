import { v4 as uuidv4 } from 'uuid'
import Vue from 'vue'
import skaler from 'skaler'
import { FilSystem } from './FilSystem'
import { FILE_TYPE } from './types/file'
import { Bucket } from './remote/textile/Bucket'
import { Config } from '~/config'
import { EnvInfo } from '~/utilities/EnvInfo'
import { isHeic } from '~/utilities/Heic'
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
    const id = uuidv4()
    await this.bucket.pushFile(file, id)

    this.createFile({
      id,
      name: file.name,
      file,
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
   * @param {string} id id and path in bucket
   */
  async removeFile(id: string) {
    await this.bucket.removeFile(id)
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
      !file.name.match(Config.regex.image) &&
      !file.name.match('^.*.(heic)$')
    ) {
      return
    }
    if (file.name.match('^.*.(svg)$')) {
      return this._fileToData(file)
    }
    if (isHeic(new Uint8Array(await file.slice(0, 256).arrayBuffer()))) {
      // prevent crash in case of larger than 2GB heic files. could possibly be broken up into multiple buffers
      if (file.size >= Config.arrayBufferLimit) {
        return
      }
      const buffer = new Uint8Array(await file.arrayBuffer())
      const outputBuffer = await convert({
        buffer,
        format: 'JPEG',
        quality: 1,
      })
      const fileJpg = new File([outputBuffer.buffer], file.name, {
        type: 'image/jpeg',
      })
      if (await this._tooLarge(fileJpg)) {
        return
      }
      return this._fileToData(await skaler(fileJpg, { width: 400 }))
    }
    if (await this._tooLarge(file)) {
      return
    }
    return this._fileToData(await skaler(file, { width: 400 }))
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

  /**
   * @method _tooLarge
   * @description determine if image exceeds platform canvas limits
   * @param {File} file needs to be an embeddable image type
   * @returns {Promise<boolean>}
   */
  private _tooLarge(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const envInfo = new EnvInfo()
        const maxDimension = Math.max(img.width, img.height)
        if (maxDimension > Config.canvasLimits[envInfo.currentPlatform]) {
          resolve(true)
        }
        resolve(false)
      }
    })
  }
}
