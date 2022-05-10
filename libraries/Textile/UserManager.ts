import { Query } from '@textile/threads-client'
import { ThreadID } from '@textile/threads-id'
import { userinfoSchema } from './schema'
import Crypto from '~/libraries/Crypto/Crypto'
import { TextileInitializationData } from '~/types/textile/manager'
import { UserdataFromThread } from '~/types/textile/user'

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
   * @returns returns the current user's info
   */
  private async _findRecord(): Promise<UserdataFromThread | null> {
    const query = Query.where('user_address').eq(this.textile.wallet.address)
    const [record] = await this.textile.client.find<UserdataFromThread>(
      this.threadID,
      CollectionName,
      query,
    )
    return record || null
  }

  async getUserRecord(): Promise<UserdataFromThread | null> {
    return await this._findRecord()
  }

  /**
   * @method setConsent
   * Set consent data for csam
   */
  async setConsent({
    consentScan,
    consentDate,
  }: {
    consentScan: boolean
    consentDate: number
  }): Promise<void> {
    const record = await this._findRecord()
    if (record) {
      record.consent_scan = consentScan
      record.consent_date = consentDate
      await this.textile.client.save(this.threadID, CollectionName, [record])
      return
    }
    await this.textile.client.create(this.threadID, CollectionName, [
      {
        user_address: this.textile.wallet.address,
        created_at: Date.now(),
        consent_scan: consentScan,
        consent_date: consentDate,
      },
    ])
  }

  /**
   * @method setBlockNsfw
   * @description set whether nsfw content should be blocked
   * @param {boolean} blockNsfw true to block, false for show
   */
  async setBlockNsfw(blockNsfw: boolean): Promise<void> {
    const record = await this._findRecord()
    if (record) {
      record.block_nsfw = blockNsfw
      await this.textile.client.save(this.threadID, CollectionName, [record])
      return
    }
    await this.textile.client.create(this.threadID, CollectionName, [
      {
        user_address: this.textile.wallet.address,
        created_at: Date.now(),
        block_nsfw: blockNsfw,
      },
    ])
  }

  /**
   * @method setFilesVersion
   * @description increment thread after update to keep all instances up to date
   * @param {number} version current version number after export
   */
  async setFilesVersion(version: number): Promise<void> {
    const record = await this._findRecord()
    if (record) {
      record.files_version = version
      await this.textile.client.save(this.threadID, CollectionName, [record])
      return
    }
    await this.textile.client.create(this.threadID, CollectionName, [
      {
        user_address: this.textile.wallet.address,
        created_at: Date.now(),
        files_version: version,
      },
    ])
  }

  async getThreadName(): Promise<string> {
    const crypto = new Crypto()
    const name = crypto.signMessageWithKey(
      this.textile.wallet.keypair.secretKey,
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
