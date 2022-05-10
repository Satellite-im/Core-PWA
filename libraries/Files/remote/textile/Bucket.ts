import { Buckets, Root } from '@textile/buckets'
import { createWriteStream } from 'streamsaver'
import { Config } from '~/config'
import {
  FileSystemExport,
  FILESYSTEM_TYPE,
} from '~/libraries/Files/types/filesystem'
import { TextileInitializationData } from '~/types/textile/manager'
import { RFM } from '~/libraries/Files/remote/abstracts/RFM.abstract'
import { RFMInterface } from '~/libraries/Files/remote/interface/RFM.interface'
import { TextileError } from '~/store/textile/types'

export class Bucket extends RFM implements RFMInterface {
  private _textile: TextileInitializationData
  private _index: FileSystemExport | null = null
  private _buckets: Buckets | null
  private _key: Root['key'] | null
  private _root: Root | Root['path'] = ''

  constructor(textile: TextileInitializationData) {
    super()
    this._textile = textile
    this._buckets = null
    this._key = null
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

    this._buckets = await Buckets.withKeyInfo(
      { key: Config.textile.key },
      { host: Config.textile.apiUrl },
    )
    await this._buckets.getToken(this._textile.identity)

    const result = await this._buckets.getOrCreate(name, { encrypted: true })

    if (!result.root) throw new Error(`failed to open bucket ${name}`)

    this._key = result.root.key
    this._root = result.root

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
    if (!this._buckets || !this._key) {
      throw new Error(TextileError.BUCKET_NOT_INITIALIZED)
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

  /**
   * @method ipnsLink
   * @returns {Promise<string>} ipns bucket link
   */
  async ipnsLink(): Promise<string> {
    if (!this._buckets || !this._key) {
      throw new Error(TextileError.BUCKET_NOT_INITIALIZED)
    }
    return (await this._buckets.links(this._key)).ipns
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
    if (!this._buckets || !this._key) {
      throw new Error(TextileError.BUCKET_NOT_INITIALIZED)
    }

    const res = await this._buckets.pushPath(
      this._key,
      path,
      {
        path,
        content: this._getStream(file),
      },
      {
        progress: (num) => {
          progressCallback(num, file.size, file.name)
        },
        root: this._root,
      },
    )
    this._root = res.root
  }

  private _getStream(file: File) {
    // @ts-ignore
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
   * @method pullFileStream
   * @description fetch encrypted file from bucket
   * @param {string} id file path in bucket
   * @param {string} name file name
   * @param {number} size file size to show progress in browser
   */
  async pullFileStream(id: string, name: string, size: number) {
    if (!this._buckets || !this._key) {
      throw new Error(TextileError.BUCKET_NOT_INITIALIZED)
    }
    const fileStream = createWriteStream(name, { size })
    const writer = fileStream.getWriter()

    window.onunload = () => writer.abort()

    for await (const bytes of this._buckets.pullPath(this._key, id)) {
      writer.write(bytes)
    }
    writer.close()
  }

  /**
   * @method removeFile
   * @description Remove file from bucket
   * @param {string} name file name
   */
  async removeFile(name: string) {
    if (!this._buckets || !this._key) {
      throw new Error(TextileError.BUCKET_NOT_INITIALIZED)
    }
    const res = await this._buckets.removePath(this._key, name, {
      root: this._root,
    })
    if (res.root) {
      this._root = res.root
    }
  }
}
