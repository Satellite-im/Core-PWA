import Vue from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { FILE_TYPE } from '../../types/file'
import { Bucket } from '~/libraries/Files/remote/abstracts/Bucket.abstract'
import { Config } from '~/config'
import { SharedBucketIndex } from '~/libraries/Files/types/filesystem'
import { TextileError } from '~/store/textile/types'
import { mimeType } from '~/utilities/FileType'
import { ChatFileUpload } from '~/store/chat/types'

export class SharedBucket extends Bucket {
  private _index: SharedBucketIndex = {
    version: 1,
    content: [],
  }

  /**
   * @getter
   * @returns file system export data
   */
  get index(): SharedBucketIndex {
    return this._index
  }

  /**
   * @method init
   * @description Initializes bucket
   * @param name bucket name
   */
  async init({ name }: { name: string }) {
    await this.getBucket({ name })
    if (!this._buckets || !this._key) {
      throw new Error(TextileError.BUCKET_NOT_INITIALIZED)
    }
    Vue.prototype.$Logger.log('Shared Bucket', 'Initialized')
    // todo - add index tracking capabilities to shared bucket
    // try {
    //   const data = []
    //   for await (const bytes of this._buckets.pullPath(
    //     this._key,
    //     Config.textile.bucketIndex,
    //   )) {
    //     data.push(bytes)
    //   }
    //   this._index = JSON.parse(
    //     await new Blob(data, {
    //       type: 'application/json',
    //     }).text(),
    //   )
    // } catch (e) {
    //   console.log(e)
    // }
  }

  /**
   * @method updateIndex
   * @param index SharedBucketIndex
   * @description sets index data and root
   */
  async updateIndex(index: SharedBucketIndex) {
    if (!this._buckets || !this._key) {
      throw new Error(TextileError.BUCKET_NOT_INITIALIZED)
    }
    this._index = index
    const res = await this._buckets.pushPath(
      this._key,
      Config.textile.bucketIndex,
      Buffer.from(JSON.stringify(index)),
      { root: this._root },
    )
    this._root = res.root
  }

  /**
   * @method uploadFile
   * @description Upload file to the bucket
   * use uuid as bucket path so files can be renamed freely
   * @param {File} file file to be uploaded
   * @param {Function} progressCallback used to show progress meter in componment that calls this method
   */
  async uploadFile(file: ChatFileUpload, progressCallback: Function) {
    const id = uuidv4()
    const res = await this.pushFile(file.file, id, progressCallback)
    // read magic byte type, use metadata as backup
    const byteType = (await mimeType(file.file)) as FILE_TYPE
    const type = byteType || file.file.type

    // todo - handle res, update index

    // this.createFile({
    //   id,
    //   name: file.name,
    //   size: file.size,
    //   type: Object.values(FILE_TYPE).includes(type) ? type : FILE_TYPE.GENERIC,
    //   thumbnail: await this._createThumbnail(file, byteType),
    //   nsfw,
    // })
  }
}
