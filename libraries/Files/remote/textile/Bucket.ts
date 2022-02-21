import {
  Buckets,
  Path,
  PushPathResult,
  RemovePathResponse,
  Root,
} from '@textile/hub'
import { RFM } from '../abstracts/RFM.abstract'
import { RFMInterface } from '../interface/RFM.interface'
import { TextileErrors } from '../../errors/Errors'
import { Config } from '~/config'
import {
  BucketConfig,
  TextileInitializationData,
} from '~/types/textile/manager'
import IdentityManager from '~/libraries/Textile/IdentityManager'
import {
  FileSystemExport,
  FILESYSTEM_TYPE,
} from '~/libraries/Files/types/filesystem'

export class Bucket extends RFM implements RFMInterface {
  private creds: { id: any; pass: any } = { id: null, pass: null }
  private identityManager: IdentityManager
  private _textile: TextileInitializationData | null = null
  private _index: FileSystemExport | null = null
  private buckets: Buckets | null
  private key: Root['key'] | null

  constructor() {
    super()
    this.identityManager = new IdentityManager()
    this.buckets = null
    this.key = null
  }

  /**
   * @getter
   * @returns textile data
   */
  get textile(): TextileInitializationData | null {
    return this._textile
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
   * @param param0 Bucket Configuration that includes id, password, SolanaWallet instance, and bucket name
   * @returns a promise that resolves when the initialization completes
   */
  async init({
    id,
    pass,
    wallet,
    name,
  }: BucketConfig): Promise<FileSystemExport | null> {
    if (!wallet) {
      throw new Error(TextileErrors.MISSING_WALLET)
    }

    const identity = await this.identityManager.initFromWallet(wallet)
    const { client, users } = await this.identityManager.authorize(identity)

    this.creds = {
      id,
      pass,
    }

    this._textile = {
      identity,
      client,
      wallet,
      users,
    }

    if (!Config.textile.key) {
      throw new Error('Textile key not found')
    }
    this.buckets = await Buckets.withKeyInfo({ key: Config.textile.key })
    await this.buckets.getToken(identity)
    const result = await this.buckets.getOrCreate(name)
    if (!result.root) throw new Error(`failed to open bucket ${name}`)
    this.key = result.root.key

    const hash = ((await this.buckets.listPath(this.key, 'index.json')) as Path)
      ?.item?.path

    this._index = await fetch(Config.textile.browser + hash)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        return data
      })
      .catch(() => {
        return {
          type: FILESYSTEM_TYPE.DEFAULT,
          version: 1,
          content: [],
        }
      })
    return this._index
  }

  /**
   * @method updateIndex
   * @param index FileSystemExport
   * @description sets file system import data
   */
  updateIndex(index: FileSystemExport) {
    if (!this.buckets || !this.key) {
      throw new Error('Bucket or bucket key not found')
    }
    this._index = index
    this.buckets.pushPath(
      this.key,
      'index.json',
      Buffer.from(JSON.stringify(index)),
    )
  }

  async ipnsLink(): Promise<string> {
    if (!this.buckets || !this.key) {
      throw new Error('Bucket or bucket key not found')
    }
    return (await this.buckets.links(this.key)).ipns
  }

  /**
   * @method pushFile
   * @description Remove file from bucket
   * @param {File} file file to be uploaded
   * @returns Promise whether it was uploaded or not
   */
  async pushFile(file: File): Promise<PushPathResult> {
    if (!this.buckets || !this.key) {
      throw new Error('Bucket or bucket key not found')
    }
    return await this.buckets.pushPath(this.key, file.name, file)
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
