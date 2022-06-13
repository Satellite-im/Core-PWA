import Vue from 'vue'
import { Bucket } from '~/libraries/Files/remote/abstracts/Bucket.abstract'
import { Config } from '~/config'
import { SharedBucketIndex } from '~/libraries/Files/types/filesystem'
import { TextileError } from '~/store/textile/types'

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
}
