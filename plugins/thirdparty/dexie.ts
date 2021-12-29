import Dexie from 'dexie'
import { Message } from '~/types/textile/mailbox'

class SatelliteDB extends Dexie {
  public conversations: Dexie.Table<DexieMessage, string>

  public constructor() {
    super('SatelliteDB')
    this.version(1).stores({
      conversations: 'key',
    })
    this.conversations = this.table('conversations')
  }
}

export const db = new SatelliteDB()

export type DexieMessage = {
  [key: string]: Message[]
  //@ts-ignore
  key: string
}
