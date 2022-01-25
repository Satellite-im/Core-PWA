import { Client, Identity, ThreadID, Users, Where } from '@textile/hub'
// @ts-ignore
import { Config } from '~/config'
import { TextileInitializationData } from '~/types/textile/manager'
import { MessageFromThread } from '~/types/textile/mailbox'
import { messageFromThread } from '~/libraries/Textile/encoders'
import { User } from '~/types/ui/user'
import { Message } from '~/mock/messages'

export default class ThreadManager {
  textile: TextileInitializationData
  senderAddress: string
  identity: Identity
  threadID: ThreadID
  token: string | null
  textileClient: Client

  constructor(
    textile: TextileInitializationData,
    senderAddress: string,
    identity: Identity,
  ) {
    this.identity = identity
    this.textile = textile
    this.senderAddress = senderAddress
    this.threadID = null
    this.token = null
    this.textileClient = textile.client
    this.identity = identity
  }

  async init() {
    if (!this.textileClient || !this.identity) {
      return new Error(
        'Attempted to interface with a thread before initializing',
      )
    }
    const id = await this.fetchThread()
    if (id) {
      this.threadID = id
      const checkForCollection = await this.ensureCollection(
        'messageCollection',
      )
      if (checkForCollection) {
        await this.getCollection('messageCollection')
      }
      return
    }
    this.threadID = await this.createThread()
  }

  /**
   * @method
   * @name createThread
   * @argument threadUsers Users to create new thread with
   * @argument threadTitle Title of new thread
   * @argument options Object containing values to pass to textile
   */
  async createThread(
    threadUsers?: Array<Object>,
    collectionName?: string,
    options?: Object,
  ) {
    this.threadID = await this.textileClient.newDB(undefined, 'groupChats')
    await this.createNewChatCollection()
    return this.threadID
  }

  async createNewChatCollection() {
    // todo: set up random uuid creation to pass in as collection name - on successful creation save uuid to blockchain

    const schema = {
      $schema: 'http://json-schema.org/draft-07/schema#',
      title: 'Message',
      type: 'object',
      properties: {
        _id: { type: 'string' },
        from: { type: 'string' },
        to: { type: 'string' },
        at: { type: 'number' },
        pinned: { type: 'boolean' },
        payload: { type: 'string' },
      },
    }
    await this.textileClient.newCollection(this.threadID, {
      name: 'messageCollection',
      schema,
    })
  }

  /**
   * @method
   * @name getCollection
   * @argument threadTitle identifier to retrieve the collection by
   * @argument options Object containing values to pass to textile
   */
  async getCollection(collectionName: string, options?: Object) {
    if (!this.textileClient || !this.identity)
      return new Error(
        'Attempted to interface with a thread before initializing',
      )
    return await this.textileClient.getCollectionInfo(
      this.threadID,
      collectionName,
    )
  }

  async ensureCollection(collectionName: string): Promise<boolean> {
    try {
      await this.getCollection('messageCollection')
      return true
    } catch (e) {
      await this.createNewChatCollection()
      return false
    }
  }

  async addNewMessage(
    collectionName: string,
    message: MessageFromThread,
  ): Promise<ThreadID> {
    await this.textileClient.create(this.threadID, 'messageCollection', [
      message,
    ])
    return this.threadID
  }

  /**
   * @method
   * @name fetchThread
   * Fetch a thread ID from our storage method
   * @argument identifier identifier string of the thread to fetch
   * @returns string ID of the thread
   */
  async fetchThread(): Promise<ThreadID> {
    const thread = await this.textile.users.getThread('groupChats')
    return ThreadID.fromString(thread.id)
  }
}
