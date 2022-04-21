import { WorkerActions } from './types'
import { SatelliteDB } from '~/libraries/SatelliteDB/SatelliteDB'
import {
  DexieConversation,
  DexieMessage,
} from '~/libraries/SatelliteDB/SatelliteDB'

export const db = new SatelliteDB()
export default db

export const dbActions: WorkerActions = {
  async storeConversationMessage({ address, message }) {
    db.conversations
      .where('key')
      .equals(address)
      .modify((conversation: DexieConversation) => {
        conversation.lastInbound = message.at
      })

    const msg = { conversation: address, ...message }
    db.search.conversationMessages.add(msg)

    // replace old message with new edited version
    if (message.editedAt) {
      db.conversationMessages
        .get(message.id)
        .then((oldMessage?: DexieMessage) => {
          if (oldMessage) {
            db.conversationMessages.put(msg)
          } else {
            db.conversationMessages.add(msg)
          }
        })
      return
    }

    // add regular message to indexeddb
    db.conversationMessages.add(msg)
  },
}
