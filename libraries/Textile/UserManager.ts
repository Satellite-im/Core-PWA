import { Query } from '@textile/threads-client'
import { ThreadID } from '@textile/threads-id'
import { userinfoSchema } from './schema'
import Crypto from '~/libraries/Crypto/Crypto'
import { TextileInitializationData } from '~/types/textile/manager'
import { UserThreadData } from '~/types/textile/user'

const CollectionName = 'userInfo'

export class UserInfoManager {
  textile: TextileInitializationData
  private _threadID?: ThreadID

  constructor(textile: TextileInitializationData) {
    this.textile = textile
  }

  /**
   * @method init
   * Initialize the userinfo manager
   */
  async init() {
    this._threadID = await this.getThreadID()
    await this.createCollection()
  }

  /**
   * @method threadID
   * Get the thread id of the user data for current user
   * @returns returns the thread id of the user data for the current user
   */
  get threadID(): ThreadID {
    if (!this._threadID) {
      throw new Error('User info manager is not initialized.')
    }
    return this._threadID
  }

  /**
   * @method createCollection
   * Create a collection for managing users
   */
  async createCollection(): Promise<void> {
    try {
      await this.textile.client.newCollection(this.threadID, {
        name: CollectionName,
        schema: userinfoSchema,
      })
    } catch (error) {}
  }

  /**
   * Find the current user consent info
   * @returns the current user's info
   */
  async getUserRecord(): Promise<UserThreadData | undefined> {
    const query = Query.where('userAddress').eq(this.textile.wallet.address)
    const [record] = await this.textile.client.find<UserThreadData>(
      this.threadID,
      CollectionName,
      query,
    )
    return record
  }

  /**
   * @method updateRecord
   * @description update any of the optional params on threaddb. creates record if it doesn't exist
   * @returns updated record
   */
  async updateRecord({
    consentToScan,
    blockNsfw,
    filesVersion,
  }: {
    consentToScan?: boolean
    blockNsfw?: boolean
    filesVersion?: number
  }): Promise<UserThreadData | undefined> {
    const record = await this.getUserRecord()
    if (!record) {
      await this.textile.client.create(this.threadID, CollectionName, [
        {
          userAddress: this.textile.wallet.address,
          consentToScan,
          blockNsfw,
          filesVersion,
        },
      ])
      return this.getUserRecord()
    }
    if (typeof consentToScan === 'boolean') {
      record.consentToScan = consentToScan
      record.consentUpdated = Date.now()
      await this.textile.client.save(this.threadID, CollectionName, [record])
      return record
    }
    if (typeof blockNsfw === 'boolean') {
      record.blockNsfw = blockNsfw
      await this.textile.client.save(this.threadID, CollectionName, [record])
      return record
    }
    if (filesVersion) {
      record.filesVersion = filesVersion
      await this.textile.client.save(this.threadID, CollectionName, [record])
      return record
    }
  }

  async getThreadName(): Promise<string> {
    const crypto = new Crypto()
    const name = crypto.signMessageWithKey(
      Buffer.from(this.textile.wallet.privateKey),
      `csam`,
    )

    return crypto.hash(name)
  }

  async getThreadID(): Promise<ThreadID> {
    const name = await this.getThreadName()
    try {
      const thread = await this.textile.client.getThread(name)
      return ThreadID.fromString(thread.id)
    } catch (e) {
      return await this.textile.client.newDB(undefined, name)
    }
  }
}
