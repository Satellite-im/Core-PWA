import { Buckets, Identity, PushPathResult, Root, Links } from '@textile/hub'
import { Config } from '~/config'
import { TextileInitializationData } from '~/types/textile/manager'

/* TODO: Buckets are not yet secure - AP-402
 encrypt storage and allow the recipent to decrypt with
 their priv key. */
export default class BucketManager {
  buckets: Buckets | null
  bucketKey: Root['key'] | null
  textile: TextileInitializationData
  identity: Identity
  bucketName: string
  prefix: string

  constructor(
    textile: TextileInitializationData,
    identity: Identity,
    prefix: string,
  ) {
    this.identity = identity
    this.textile = textile
    this.buckets = null
    this.bucketKey = null
    this.bucketName = 'v74files'
    this.prefix = prefix
  }

  /**
   * @method progressParse
   * @description handles progress math from file size
   * @param uploaded how much of file has been uploaded
   * @param2 total actual size of file
   * @example progressParse(returnedNumber, file.size)
   */
  private progressParse(uploaded: number, total: number) {
    return (uploaded / total) * 100
  }

  async init() {
    if (!Config.textile.key) {
      throw new Error('Textile key not found')
    }
    this.buckets = await Buckets.withKeyInfo({ key: Config.textile.key })
    await this.buckets.getToken(this.identity)
    const result = await this.buckets.getOrCreate(
      `hub.textile.io/ipfs/${this.identity}/${this.prefix}`,
    )
    if (!result.root) throw new Error('failed to open buckets')
    this.bucketKey = result.root.key
    await this.ensureIndex()
  }

  async removeFromIndex(file: File) {
    const path = `${this.prefix}/index.json`
    if (!this.buckets || !this.bucketKey) return
    const bytesStream = await this.buckets?.pullPath(this.bucketKey, path)
    let array: any[] = []
    if (bytesStream) {
      const next = await bytesStream.next()
      const value = next.value
      const oldIndex = JSON.parse(Buffer.from(value).toString())
      array = [...oldIndex.paths]
    }

    const filtered = array.filter((item) => {
      // @ts-ignore
      return item.file.name !== file.file.name
    })

    const index = {
      date: new Date().getTime(),
      meta: {},
      paths: filtered,
    }
    // Store the index in the Bucket (or in the Thread later)
    const buf = Buffer.from(JSON.stringify(index, null, 2))
    await this.buckets.pushPath(this.bucketKey, path, buf)
  }

  async addToIndex(file: File, root: string | undefined, remotePath: string) {
    const path = `${this.prefix}/index.json`
    if (!this.buckets || !this.bucketKey) return
    const bytesStream = await this.buckets?.pullPath(this.bucketKey, path)
    let array: any[] = []
    if (bytesStream) {
      const next = await bytesStream.next()
      const value = next.value
      const oldIndex = JSON.parse(Buffer.from(value).toString())
      array = [...oldIndex.paths]
    }
    const index = {
      date: new Date().getTime(),
      meta: {},
      paths: [
        ...array,
        {
          at: Date.now(),
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
            author: this.prefix,
          },
          path: remotePath,
          remote: encodeURI(`${Config.textile.browser}${root}${remotePath}`),
        },
      ],
    }
    // Store the index in the Bucket (or in the Thread later)
    const buf = Buffer.from(JSON.stringify(index, null, 1))
    await this.buckets.pushPath(this.bucketKey, path, buf)
  }

  async ensureIndex(): Promise<boolean> {
    const path = `${this.prefix}/index.json`
    return new Promise((resolve) => {
      if (!this.buckets || !this.bucketKey) return null
      this.buckets
        .listPath(this.bucketKey, path)
        .then(() => {
          resolve(true)
        })
        .catch(async (e) => {
          const index = {
            date: new Date().getTime(),
            meta: {},
            paths: [],
          }
          // Store the index in the Bucket (or in the Thread later)
          const buf = Buffer.from(JSON.stringify(index, null, 2))
          if (!this.buckets || !this.bucketKey) return null
          await this.buckets.pushPath(this.bucketKey, path, buf)
          resolve(false)
        })
    })
  }

  async fetchIndex(): Promise<object> {
    const path = `${this.prefix}/index.json`
    if (!this.buckets || !this.bucketKey) return {}
    const bytesStream = await this.buckets?.pullPath(this.bucketKey, path)
    const next = await bytesStream.next()
    const value = next.value
    const index = JSON.parse(Buffer.from(value).toString())
    return index
  }

  async pushFile(
    file: File,
    path: string,
    progress?: CallableFunction,
  ): Promise<PushPathResult> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onabort = () => reject(new Error('file reading was aborted'))
      reader.onerror = () => reject(new Error('file reading has failed'))
      reader.onload = () => {
        if (!this.buckets || !this.bucketKey) {
          reject(new Error('Please init first'))
          return
        }
        const binaryStr = reader.result
        this.buckets
          .pushPath(this.bucketKey, `${path}`, binaryStr, {
            progress: (num) => {
              if (progress && num) progress(this.progressParse(num, file.size))
            },
          })
          .then((raw) => {
            resolve(raw)
          })
          .catch((error) => {
            throw error
          })
      }
      reader.readAsArrayBuffer(file)
    })
  }

  async getBucket(): Promise<Root | undefined> {
    if (!this.buckets) return undefined
    const roots = await this.buckets.list()
    return roots.find((bucket) => bucket.name === this.bucketName)
  }

  async getLinks(): Promise<Links | undefined> {
    if (!this.buckets || !this.bucketKey) return undefined
    const links = await this.buckets.links(this.bucketKey)
    return links
  }
}
