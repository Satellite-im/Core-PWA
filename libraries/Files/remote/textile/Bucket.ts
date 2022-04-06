import { Buckets, PushPathResult, RemovePathResponse, Root } from '@textile/hub'
import { RFM } from '../abstracts/RFM.abstract'
import { RFMInterface } from '../interface/RFM.interface'
import { Config } from '~/config'
import { TextileInitializationData } from '~/types/textile/manager'
import {
  FileSystemExport,
  FILESYSTEM_TYPE,
} from '~/libraries/Files/types/filesystem'
import { FILE_TYPE } from '~/libraries/Files/types/file'

export class Bucket extends RFM implements RFMInterface {
  private _textile: TextileInitializationData
  private _index: FileSystemExport | null = null
  private buckets: Buckets | null
  private key: Root['key'] | null

  constructor(textile: TextileInitializationData) {
    super()
    this._textile = textile
    this.buckets = null
    this.key = null
  }

  /**
   * @getter
   * @returns file system export data
   */
  get index(): FileSystemExport | null {
    return this._index
  }

  /**
   * @method init
   * @description Initializes bucket
   * @param name bucket name
   * @returns a promise that resolves when the initialization completes
   */
  async init(name: string): Promise<FileSystemExport> {
    if (!Config.textile.key) {
      throw new Error('Textile key not found')
    }

    this.buckets = await Buckets.withKeyInfo({ key: Config.textile.key })
    await this.buckets.getToken(this._textile.identity)

    const result = await this.buckets.getOrCreate(name, { encrypted: true })

    if (!result.root) throw new Error(`failed to open bucket ${name}`)

    this.key = result.root.key

    try {
      const data = []
      for await (const bytes of this.buckets.pullPath(
        this.key,
        Config.textile.fsTable,
      )) {
        data.push(bytes)
      }
      this._index = JSON.parse(
        await new Blob(data, {
          type: 'application/json',
        }).text(),
      )

      if (!this._index) throw new Error('Index not found')

      return this._index
    } catch (e) {
      return {
        type: FILESYSTEM_TYPE.DEFAULT,
        version: 1,
        content: [],
      }
    }
  }

  /**
   * @method updateIndex
   * @param index FileSystemExport
   * @description sets file system import data
   */
  async updateIndex(index: FileSystemExport) {
    if (!this.buckets || !this.key) {
      throw new Error('Bucket or bucket key not found')
    }
    this._index = index
    await this.buckets.pushPath(
      this.key,
      Config.textile.fsTable,
      Buffer.from(JSON.stringify(index)),
    )
  }

  /**
   * @method ipnsLink
   * @returns {Promise<string>} ipns bucket link
   */
  async ipnsLink(): Promise<string> {
    if (!this.buckets || !this.key) {
      throw new Error('Bucket or bucket key not found')
    }
    return (await this.buckets.links(this.key)).ipns
  }

  /**
   * @method pushFile
   * @description Add file to bucket
   * @param {File} file file to be uploaded
   * @param {Function} progressCallback used to show progress meter in componment that calls this method
   * @returns Promise whether it was uploaded or not
   */
  async pushFile(
    file: File,
    id: string,
    progressCallback: Function,
  ): Promise<PushPathResult> {
    if (!this.buckets || !this.key) {
      throw new Error('Bucket or bucket key not found')
    }
    return await this.buckets.pushPath(this.key, id, file, {
      progress: (num) => {
        progressCallback(num, file.size)
      },
    })
  }

  /**
   * @method pullFile
   * @description fetch encrypted file from bucket
   * @param {string} id file path in bucket
   * @param {string} type file mime type
   * @returns Promise of File
   */
  async pullFile(
    id: string,
    name: string,
    type: string,
  ): Promise<File | undefined> {
    if (!this.buckets || !this.key) {
      throw new Error('Bucket or bucket key not found')
    }

    const data = []
    for await (const bytes of this.buckets.pullPath(this.key, id)) {
      data.push(bytes)
    }
    // if type is unknown(generic), then don't use in File constructor
    return new File(data, name, {
      type: type === FILE_TYPE.GENERIC ? '' : type,
    })
  }

  /**
   * @method removeFile
   * @description Remove file from bucket
   * @param {string} name file name
   * @returns Promise whether it was removed or not
   *
   */
  async removeFile(name: string): Promise<RemovePathResponse> {
    if (!this.buckets || !this.key) {
      throw new Error('Bucket or bucket key not found')
    }
    return await this.buckets.removePath(this.key, name)
  }
}
