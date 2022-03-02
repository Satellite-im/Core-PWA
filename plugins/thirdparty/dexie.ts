import Dexie from 'dexie'
import { Message } from '~/types/textile/mailbox'

export type DexieConversation = {
  key: string
  lastInbound: number
}
export type DexieMessage = Message & {
  conversation: string
}
export class SatelliteDB extends Dexie {
  public conversations: Dexie.Table<DexieConversation, string>
  public conversationMessages: Dexie.Table<DexieMessage, string>

  public constructor() {
    super('SatelliteDB')
    this.version(1).stores({
      conversations: 'key',
    })
    this.version(2)
      .stores({
        conversations: 'key, lastInbound',
        conversationMessages:
          'id, conversation, from, to, at, readAt, type, payload',
      })
      .upgrade((tx) => {
        return tx
          .table('conversations')
          .toCollection()
          .modify(async (chat: any) => {
            await Promise.all(
              chat?.conversation?.map((conversation: any) => {
                console.info('conversation', conversation)
                return tx
                  .table('conversationMessages')
                  .add({ ...conversation, conversation: chat.key })
              }),
            )
            delete chat.conversation
          })
      })
    this.conversations = this.table('conversations')
    this.conversationMessages = this.table('conversationMessages')
  }
}

export const db = new SatelliteDB()
