import { Dexie } from 'dexie'
import SearchIndex from './SearchIndex'
import { Message } from '~/types/textile/mailbox'
import { Config } from '~/config'

export type DexieConversation = {
  key: string
  lastInbound: number
}
export type DexieMessage = Message & {
  conversation: string
}

export type DexieFriend = {
  address: string
  name: string
  photoHash: string | undefined
  textilePubkey: string
  lastUpdate: number
}

export type KeyValue = {
  key: string
  value: string
  namespace: string
}

export class SatelliteDB extends Dexie {
  public isInitialized: boolean = false
  public isSearchInitialized: boolean = false
  public conversations: Dexie.Table<DexieConversation, string>
  public conversationMessages: Dexie.Table<DexieMessage, string>
  public friends: Dexie.Table<DexieFriend, string>
  public keyValue: Dexie.Table<KeyValue, string>

  public search: {
    [key: string]: SearchIndex
  } = {}

  public constructor() {
    super(Config.indexedDbName)
    this.initializeSchema()

    this.conversations = this.table('conversations')
    this.conversationMessages = this.table('conversationMessages')
    this.friends = this.table('friends')
    this.keyValue = this.table('keyValue')
  }

  /**
   * Initialize the schema for the database.
   * @returns {void}
   */
  initializeSchema() {
    if (this.isInitialized) return
    this.version(1).stores({
      conversations: 'key, lastInbound',
      conversationMessages:
        '&id, conversation, from, to, at, readAt, type, payload',
    })

    this.version(2).stores({
      friends: '&address, textilePubkey, name, photoHash, lastUpdate',
    })

    this.version(3).stores({
      keyValue: '&key, value, namespace',
    })
    this.isInitialized = true
  }

  /**
   * Initialize search indexes for tables that have them.
   * @returns {Promise<void>
   */
  async initializeSearchIndexes() {
    if (this.isSearchInitialized) return
    const searchIndexes: KeyValue[] = await this.keyValue
      .where('namespace')
      .equals('searchIndex')
      .toArray()
    for (const index of searchIndexes) {
      const { key, value } = index
      if (typeof key === 'string' && value) {
        try {
          this.search[key] = SearchIndex.deserialize(value)
        } catch (_) {}
      }
    }

    if (!this.search.friends) {
      this.search.friends = new SearchIndex({
        schema: {
          fields: ['address', 'name', 'photoHash', 'textilePubkey'],
          storeFields: ['address'],
          idField: 'address',
        },
      })
    }

    if (!this.search.conversationMessages) {
      this.search.conversationMessages = new SearchIndex({
        schema: {
          fields: [
            'id',
            'conversation',
            'from',
            'to',
            'at',
            'readAt',
            'type',
            'payload',
          ],
          storeFields: ['id', 'conversation', 'from'],
        },
      })
    }
    this.isSearchInitialized = true
  }

  /**
   *
   * @param table the name of the table
   * @param where the where clause
   * @param data the data to insert or update. if inserting, will merge with where clause,
   * @returns {Promise<IndexableType>}
   */
  async upsert(
    table: string,
    where: { [key: string]: any },
    data: { [key: string]: any },
  ) {
    if (this.search[table]) {
      this.search[table].add({ ...where, ...data })
    }
    const exists = await this.table(table).get(where)
    if (exists) {
      return this.table(table).update(where, data)
    }
    return this.table(table).add({ ...where, ...data })
  }

  async saveSearchIndexes() {
    for (const [key, index] of Object.entries(this.search)) {
      await this.keyValue.put({
        key,
        value: index.serialize(),
        namespace: 'searchIndex',
      })
    }
  }
}

export const db = new SatelliteDB()
export default db
