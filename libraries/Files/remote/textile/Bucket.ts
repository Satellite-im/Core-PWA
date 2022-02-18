import { Buckets, PushPathResult, Root } from '@textile/hub'
import { RFM } from '../abstracts/RFM.abstract'
import { RFMInterface } from '../interface/RFM.interface'
import { TextileErrors } from '../../errors/Errors'
import { Config } from '~/config'
import {
  BucketConfig,
  TextileInitializationData,
} from '~/types/textile/manager'
import IdentityManager from '~/libraries/Textile/IdentityManager'
import { FileSystemExport } from '~/libraries/Files/types/filesystem'

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
   * @method updateIndex
   * @param index FileSystemExport
   * @description sets file system import data
   */
  updateIndex(index: FileSystemExport) {
    this._index = index
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
  }: BucketConfig): Promise<TextileInitializationData> {
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

    // const testFile = await new File(['hello'], 'test_fil.txt', {
    //   type: 'text/plain',
    // })

    // const x = await this.pushFile(testFile)

    // console.log(x)

    // this.remove('test_fil.txt')

    return this._textile
  }

  async ipnsLink(): Promise<string> {
    if (!this.buckets || !this.key) {
      throw new Error('Bucket or bucket key not found')
    }
    return await (
      await this.buckets.links(this.key)
    ).ipns
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
   * @method remove
   * @description Remove file from bucket
   * @param {string} path file name
   */
  async remove(path: string) {
    if (!this.buckets || !this.key) {
      throw new Error('Bucket or bucket key not found')
    }
    this.buckets.removePath(this.key, path)
  }
}
