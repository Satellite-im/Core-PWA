import { Identity, PrivateKey, PublicKey, Query, ThreadID } from '@textile/hub'
import { EncodingTypesEnum } from '../Enums/enums'
import { metadataSchema } from '~/libraries/Textile/schema'
import { TextileInitializationData } from '~/types/textile/manager'
import { FriendMetadata, MetadataFromThread } from '~/types/textile/metadata'

const CollectionName = 'metadata'
const FriendsKey = 'friends'

export class MetadataManager {
  textile: TextileInitializationData
  threadID?: ThreadID

  constructor(textile: TextileInitializationData) {
    this.textile = textile
  }

  /**
   * @method init
   * Initialize the metadata manager
   */
  async init() {
    await this._getMetadataCollection()
  }

  /**
   * @method getMetadataCollection
   * Create a metadata collection with specific users
   * @returns a string name of the created metadata collection
   */
  private async _getMetadataCollection(): Promise<string> {
    const thread = await this.textile.users.getThread('hubmail')
    this.threadID = ThreadID.fromString(thread.id)
    try {
      await this.textile.client.newCollection(this.threadID, {
        name: CollectionName,
        schema: metadataSchema,
      })
    } catch (e) {}
    return CollectionName
  }

  /**
   * @method _threadID
   * Get the thread id of the metadata for the current user
   * @returns returns the thread id of the metadata for the current user
   */
  private _threadID(): ThreadID {
    if (!this.threadID) {
      throw new Error('Metadata manager is not initialized.')
    }
    return this.threadID
  }

  /**
   * @method decodeBody
   * Decode the string using current user's private key
   * @param body encoded string data to be decoded
   * @returns returns decoded string from body
   */
  private async _decodeBody(body: string) {
    const identity: Identity = this.textile.identity
    const privKey = PrivateKey.fromString(identity.toString())
    const msgBody = Buffer.from(body, EncodingTypesEnum.BASE64)
    const bytes = await privKey.decrypt(msgBody)
    const decoded = new TextDecoder().decode(bytes)
    return decoded
  }

  /**
   * @method encodeBody
   * Encode the string using current user's public key
   * @param body raw string data to be encoded
   * @returns returns decoded string from encoded string
   */
  private async _encodeBody(body: string) {
    const publicKey = PublicKey.fromString(
      this.textile.identity.public.toString(),
    )
    const encoder = new TextEncoder()
    const encodedBuffer = encoder.encode(body)
    const encoded = Buffer.from(
      await publicKey.encrypt(encodedBuffer),
    ).toString(EncodingTypesEnum.BASE64)
    return encoded
  }

  /**
   * Find the current user's metadata identified by `to` and `key`
   * @param to address field to be identified
   * @param key key field to be identified
   * @returns returns the current user's metadata
   */
  private async _findRecord({
    to,
    key,
  }: {
    to?: string
    key?: string
  }): Promise<MetadataFromThread | null> {
    const threadID = this._threadID()
    const query = Query.where('from').eq(this.textile.wallet.address)
    if (to) {
      query.and('to').eq(to)
    }
    if (key) {
      query.and('key').eq(key)
    }
    const records = await this.textile.client.find<MetadataFromThread>(
      threadID,
      CollectionName,
      query,
    )

    if (records.length === 0) {
      return null
    }
    const [record] = records
    return record
  }

  /**
   * Get the current user's metadata identified by `to` and `key`
   * @param to address field to be identified
   * @param key key field to be identified
   * @returns returns the current user's metadata
   */
  async getMetadata({
    to,
    key,
  }: {
    to?: string
    key?: string
  }): Promise<Object | null> {
    const query = Query.where('from').eq(this.textile.wallet.address)
    if (to) {
      query.and('to').eq(to)
    }
    if (key) {
      query.and('key').eq(key)
    }
    const record = await this._findRecord({ to, key })
    if (!record) return null
    const body = await this._decodeBody(record.body)
    return JSON.parse(body)
  }

  async getFriendMetadata(to: string): Promise<FriendMetadata | null> {
    const metadata = await this.getMetadata({ to, key: FriendsKey })
    return metadata as FriendMetadata
  }

  /**
   * Update the current user's metadata identified by `to` and `key`
   * @param to address field to be identified
   * @param key key field to be identified
   */
  async updateMetadata({
    to,
    key,
    metadata,
  }: {
    to?: string
    key?: string
    metadata: Object
  }) {
    const threadID = this._threadID()
    const body = await this._encodeBody(JSON.stringify(metadata))
    const record = await this._findRecord({ to, key })
    if (record) {
      record.body = body
      await this.textile.client.save(threadID, CollectionName, [record])
      return
    }
    await this.textile.client.create(threadID, CollectionName, [
      {
        from: this.textile.wallet.address,
        to,
        key,
        body,
      },
    ])
  }

  /**
   * Update the current user's friend metadata
   * @param to friend address field
   */
  async updateFriendMetadata({
    to,
    metadata,
  }: {
    to: string
    metadata: FriendMetadata
  }) {
    await this.updateMetadata({ to, key: FriendsKey, metadata })
  }
}
