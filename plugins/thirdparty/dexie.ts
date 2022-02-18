import Dexie from 'dexie'
import { Message } from '~/types/textile/mailbox'

export type DexieMessage = {
  key: string
  conversation: Message[]
  lastInbound: number
}
class SatelliteDB extends Dexie {
  public conversations: Dexie.Table<DexieMessage, string>

  public conversations1: Dexie.Table<any, string>
  public constructor() {
    super('SatelliteDB')
    this.version(2).stores({
      conversations: 'key',
      conversations1: '++id, at, payload, address',
    })

    this.open().catch((err) => {
      console.log('Failed to open db: ', err)
    })

    this.conversations = this.table('conversations')
    this.conversations1 = this.table('conversations1')
  }
}

export const db = new SatelliteDB()
