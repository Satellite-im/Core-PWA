import Dexie from 'dexie'
import { Message } from '~/types/textile/mailbox'

export type DexieMessage = {
  key: string
  conversation: Message[]
  lastInbound: number
}
export class SatelliteDB extends Dexie {
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
