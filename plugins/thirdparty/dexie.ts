import Dexie from 'dexie'
import { MessageGroup } from '~/types/messaging'

class SatelliteDB extends Dexie {
  public conversations: Dexie.Table<MessageGroup>

  public constructor() {
    super('SatelliteDB')
    this.version(1).stores({
      conversations: 'id',
    })
    this.conversations = this.table('conversations')
  }
}

export const db = new SatelliteDB()
