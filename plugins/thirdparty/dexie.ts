import Dexie from 'dexie'
import { Conversation } from '~/store/textile/types'
import { DeepOmit } from '../local/deepOmit'

class SatelliteDB extends Dexie {
  public conversations: Dexie.Table<DexieConversation> // id is number in this case

  public constructor() {
    super('SatelliteDB')
    this.version(1).stores({
      conversations: 'textileId',
    })
    this.conversations = this.table('conversations')
  }
}

export const db = new SatelliteDB()

db.transaction('rw', db.conversations, async () => {
  //   const id = 'oyoyoyoyooy'
  //   await db.conversations.add({
  //     [id]: {
  //       messages: {},
  //       replies: {},
  //       reactions: {},
  //       lastInbound: 45,
  //       lastUpdate: 4656,
  //     },
  //     textileId: id,
  //   })
}).catch((e) => {
  alert(e.stack || e)
})

interface DexieConversation
  extends DeepOmit<Conversation, 'end, limit, skip'> {}
