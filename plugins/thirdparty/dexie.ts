import Dexie from 'dexie'
import { MessageGroup } from '~/types/messaging'

class SatelliteDB extends Dexie {
  public conversations: Dexie.Table<DexieMessageGroup, string>

  public constructor() {
    super('SatelliteDB')
    this.version(1).stores({
      conversations: 'key',
    })
    this.conversations = this.table('conversations')
  }
}

export const db = new SatelliteDB()

type DexieMessageGroup = {
  [key: string]: MessageGroup
  key: any // string, declared any to bypass ts error
}
