import { RFM } from '../abstracts/RFM.abstract'
import { RFMInterface } from '../interface/RFM.interface'
import { TextileErrors } from '../../errors/Errors'
import {
  TextileConfig,
  TextileInitializationData,
} from '~/types/textile/manager'
import IdentityManager from '~/libraries/Textile/IdentityManager'
import { FileSystem } from '~/libraries/Files/FileSystem'
import {
  FileSystemExport,
  FILESYSTEM_TYPE,
} from '~/libraries/Files/types/filesystem'

export class Bucket extends RFM implements RFMInterface {
  private creds: { id: any; pass: any } = { id: null, pass: null }
  private identityManager: IdentityManager
  private _textile: TextileInitializationData | null = null
  private _index: FileSystemExport = {
    type: FILESYSTEM_TYPE.DEFAULT,
    version: 1,
    content: [],
  }

  constructor(fileSystem: FileSystem) {
    super(fileSystem)
    this.identityManager = new IdentityManager()
  }

  get textile(): TextileInitializationData | null {
    return this._textile
  }

  get fileSystem(): FileSystem {
    return this._fileSystem
  }

  get index(): FileSystemExport {
    return this._index
  }

  /**
   * @method
   * Initialization function that creates a Textile identity
   * and initializes the Mailbox
   * @param param0 Textile Configuration that includes id, password and SolanaWallet instance
   * @returns a promise that resolves when the initialization completes
   */
  async init({
    id,
    pass,
    wallet,
  }: TextileConfig): Promise<TextileInitializationData> {
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

    return this._textile
  }

  updateIndex(index: FileSystemExport) {
    this._index = index
  }
}
