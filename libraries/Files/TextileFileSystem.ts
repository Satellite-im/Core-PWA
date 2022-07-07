import { v4 as uuidv4 } from 'uuid'
import Vue from 'vue'
import { FilSystem } from './FilSystem'
import { FILE_TYPE } from './types/file'
import { PersonalBucket } from './remote/textile/PersonalBucket'
import createThumbnail from '~/utilities/Thumbnail'
import { blobToBase64 } from '~/utilities/BlobManip'

export class TextileFileSystem extends FilSystem {
  /**
   * @getter bucket
   * @returns {PersonalBucket} bucket global to upload files to textile
   */
  get bucket(): PersonalBucket {
    return Vue.prototype.$TextileManager.personalBucket
  }

  /**
   * @method uploadFile
   * @description Upload file to the bucket and create in the file system afterwards
   * use uuid as bucket path so files can be renamed freely
   * @param {File} file file to be uploaded
   * @param {Function} progressCallback used to show progress meter in componment that calls this method
   */
  async uploadFile(file: File, nsfw: boolean, progressCallback: Function) {
    const id = uuidv4()
    await this.bucket.pushFile(file, id, progressCallback)

    const thumbnail = await createThumbnail(file, 400)

    this.createFile({
      id,
      name: file.name,
      size: file.size,
      type: Object.values(FILE_TYPE).includes(file.type as FILE_TYPE)
        ? (file.type as FILE_TYPE)
        : FILE_TYPE.GENERIC,
      thumbnail: thumbnail ? await blobToBase64(thumbnail) : '',
      nsfw,
    })
  }

  /**
   * @method removeFile
   * @description Remove file/folder from bucket and file system
   * @param {string} id uuid = path in bucket
   */
  async removeFile(id: string) {
    await this.bucket.removeFile(id)
  }
}
