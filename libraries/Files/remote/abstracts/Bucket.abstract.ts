import { Buckets, PushPathResult, Root } from '@textile/buckets'
import { createWriteStream } from 'streamsaver'
import { Config } from '~/config'
import {
  PersonalBucketIndex,
  SharedBucketIndex,
} from '~/libraries/Files/types/filesystem'
import { TextileInitializationData } from '~/types/textile/manager'
import { RFM } from '~/libraries/Files/remote/abstracts/RFM.abstract'
import { TextileError } from '~/store/textile/types'

export abstract class Bucket extends RFM {
  protected _textile?: TextileInitializationData
  protected _buckets?: Buckets
  protected _key?: Root['key']
  protected _root?: Root | Root['path']

  constructor(textile: TextileInitializationData) {
    super()
    this._textile = textile
  }

  abstract get index(): PersonalBucketIndex | SharedBucketIndex | undefined

  /**
   * @method getBucket
   * @description Initializes bucket
   * @param param0 bucket name and encrypted status
   * @returns a promise that resolves when the initialization completes
   */
  async getBucket({ name, encrypted }: { name: string; encrypted?: boolean }) {
    if (!Config.textile.key) {
      throw new Error('Textile key not found')
    }

    this._buckets = await Buckets.withKeyInfo(
      { key: Config.textile.key },
      { host: Config.textile.apiUrl },
    )
    if (!this._textile?.identity) {
      throw new Error('textile not initialized')
    }
    await this._buckets.getToken(this._textile.identity)

    const result = await this._buckets.getOrCreate(name, { encrypted })

    if (!result.root) throw new Error(`failed to open bucket ${name}`)

    this._key = result.root.key
    this._root = result.root
  }

  /**
   * @method pushFile
   * @description Add file to bucket
   * stream upload syntax - https://textileio.github.io/js-textile/docs/hub.buckets.pushpath#example-2
   * @param {File} file file to be uploaded
   * @param {string} path uuid to maintain unique bucket paths
   * @param {Function} progressCallback used to show progress meter in componment that calls this method
   * @returns {string} path to file, used moreso for shared buckets
   */
  async pushFile(
    file: File,
    path: string,
    progressCallback: Function,
  ): Promise<PushPathResult> {
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
    return res
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
   * @method pullFile
   * @description fetch encrypted file from bucket
   * @param {string} id file path in bucket
   * @param {string} name file name
   * @param {number} size file size to show progress in browser
   */
  async pullFile(id: string, name: string, size: number) {
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
   * @param {string} id file path in bucket
   */
  async removeFile(id: string) {
    if (!this._buckets || !this._key) {
      throw new Error(TextileError.BUCKET_NOT_INITIALIZED)
    }
    const res = await this._buckets.removePath(this._key, id, {
      root: this._root,
    })
    if (res.root) {
      this._root = res.root
    }
  }
}
