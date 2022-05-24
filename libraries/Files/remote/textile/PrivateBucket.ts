import Vue from 'vue'
import { BucketAbstract } from '~/libraries/Files/remote/abstracts/Bucket.abstract'
import { Config } from '~/config'
import { FileSystemExport } from '~/libraries/Files/types/filesystem'

export class PrivateBucket extends BucketAbstract {
  private _index?: FileSystemExport

  /**
   * @getter
   * @returns file system export data
   */
  get index(): FileSystemExport | undefined {
    return this._index
  }

  /**
   * @method init
   * @description Initializes bucket
   * @param name bucket name
   */
  async init({ name, encrypted }: { name: string; encrypted: boolean }) {
    await this.getBucket({ name, encrypted })
    if (!this._buckets || !this._key) {
      throw new Error('Bucket or bucket key not found')
    }
    try {
      const data = []
      for await (const bytes of this._buckets.pullPath(
        this._key,
        Config.textile.fsTable,
      )) {
        data.push(bytes)
      }
      this._index = JSON.parse(
        await new Blob(data, {
          type: 'application/json',
        }).text(),
      )
      Vue.prototype.$Logger.log('File System', 'Initialized')
    } catch (e) {
      Vue.prototype.$Logger.log('File System', 'Not Found')
    }
  }

  /**
   * @method updateIndex
   * @param index FileSystemExport
   * @description sets file system import data
   */
  async updateIndex(index: FileSystemExport) {
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
