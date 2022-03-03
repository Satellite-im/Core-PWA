import { Identity, PrivateKey, PublicKey, Query, ThreadID } from '@textile/hub'
import { EncodingTypesEnum } from '../Enums/enums'
import { metadataSchema } from '~/libraries/Textile/schema'
import { TextileInitializationData } from '~/types/textile/manager'
import { FriendMetadata, MetadataFromThread } from '~/types/textile/metadata'

const CollectionName = 'metadata'
const FriendsKey = 'friends'

export class MetadataManager {
  senderAddress: string
  textile: TextileInitializationData
  threadID?: ThreadID

  constructor(textile: TextileInitializationData, senderAddress: string) {
    this.textile = textile
    this.senderAddress = senderAddress
  }

  async init() {
    await this.getMetadataCollection()
  }

  /**
   * @method getMetadataCollection
   * Create a metadata collection with specific users
   * @returns a string name of the created metadata collection
   */
  async getMetadataCollection(): Promise<string> {
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
   * @description returns the thread id of the metadata for the current user
   */
  _threadID(): ThreadID {
    if (!this.threadID) {
      throw new Error('Metadata manager is not initialized.')
    }
    return this.threadID
  }

  async decodeBody(body: string) {
    const identity: Identity = this.textile.identity
    const privKey = PrivateKey.fromString(identity.toString())
    const msgBody = Buffer.from(body, EncodingTypesEnum.BASE64)
    const bytes = await privKey.decrypt(msgBody)
    const decoded = new TextDecoder().decode(bytes)
    return decoded
  }

  async encodeBody(body: string) {
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

  async _findRecord({
    to,
    key,
  }: {
    to?: string
    key?: string
  }): Promise<MetadataFromThread | null> {
    const threadID = this._threadID()
    const query = Query.where('from').eq(this.senderAddress)
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

  async getMetadata({
    to,
    key,
  }: {
    to?: string
    key?: string
  }): Promise<Object | null> {
    const query = Query.where('from').eq(this.senderAddress)
    if (to) {
      query.and('to').eq(to)
    }
    if (key) {
      query.and('key').eq(key)
    }
    const record = await this._findRecord({ to, key })
    if (!record) return null
    const body = await this.decodeBody(record.body)
    return JSON.parse(body)
  }

  async getFriendMetadata(to: string): Promise<FriendMetadata | null> {
    const metadata = await this.getMetadata({ to, key: FriendsKey })
    return metadata as FriendMetadata
  }

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
    const body = await this.encodeBody(JSON.stringify(metadata))
    const record = await this._findRecord({ to, key })
    if (record) {
      record.body = body
      await this.textile.client.save(threadID, CollectionName, [record])
    } else {
      await this.textile.client.create(threadID, CollectionName, [
        {
          from: this.senderAddress,
          to,
          key,
          body,
        },
      ])
    }
  }

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
