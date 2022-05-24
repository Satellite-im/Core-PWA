import { BucketAbstract } from '~/libraries/Files/remote/abstracts/Bucket.abstract'
import { Config } from '~/config'
import {
  FILESYSTEM_TYPE,
  SharedBucketIndex,
} from '~/libraries/Files/types/filesystem'

export class SharedBucket extends BucketAbstract {
  private _index: SharedBucketIndex = {
    type: FILESYSTEM_TYPE.DEFAULT,
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
      throw new Error('Bucket or bucket key not found')
    }
    // todo - add index tracking capabilities to shared bucket
    // try {
    //   const data = []
    //   for await (const bytes of this._buckets.pullPath(
    //     this._key,
    //     Config.textile.fsTable,
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
      throw new Error('Bucket or bucket key not found')
    }
    this._index = index
    const res = await this._buckets.pushPath(
      this._key,
      Config.textile.fsTable,
      Buffer.from(JSON.stringify(index)),
      { root: this._root },
    )
    this._root = res.root
  }
}
