import { Buckets, RemovePathResponse, Root } from '@textile/hub'
import { createWriteStream } from 'streamsaver'
import { RFM } from '../abstracts/RFM.abstract'
import { RFMInterface } from '../interface/RFM.interface'
import { Config } from '~/config'
import { TextileInitializationData } from '~/types/textile/manager'
import {
  FileSystemExport,
  FILESYSTEM_TYPE,
} from '~/libraries/Files/types/filesystem'

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
   * stream upload syntax - https://textileio.github.io/js-textile/docs/hub.buckets.pushpath#example-2
   * @param {File} file file to be uploaded
   * @param {string} path uuid to maintain unique bucket paths
   * @param {Function} progressCallback used to show progress meter in componment that calls this method
   */
  async pushFile(file: File, path: string, progressCallback: Function) {
    if (!this.buckets || !this.key) {
      throw new Error('Bucket or bucket key not found')
    }

    await this.buckets.pushPath(
      this.key,
      path,
      {
        path,
        content: this._getStream(file),
      },
      {
        progress: (num) => {
          progressCallback(num, file.size, file.name)
        },
      },
    )
  }

  private _getStream(file: File) {
    const reader = file.stream().getReader()
    const stream = new ReadableStream({
      start(controller) {
        function push() {
          return reader
            .read()
            .then(({ done, value }: { done: boolean; value: Uint8Array }) => {
              if (done) {
                controller.close()
                return
              }
              controller.enqueue(value)
              push()
            })
        }
        push()
      },
    })
    return stream
  }

  /**
   * @method pullFile
   * @description fetch encrypted file from bucket
   * @param {string} id file path in bucket
   * @param {string} name file name
   * @param {number} size file size to show progress in browser
   * @returns Promise of File
   */
  async pullFileStream(id: string, name: string, size: number) {
    if (!this.buckets || !this.key) {
      throw new Error('Bucket or bucket key not found')
    }
    const fileStream = createWriteStream(name, { size })
    const writer = fileStream.getWriter()

    window.onunload = () => writer.abort()

    for await (const bytes of this.buckets.pullPath(this.key, id)) {
      writer.write(bytes)
    }
    writer.close()
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
