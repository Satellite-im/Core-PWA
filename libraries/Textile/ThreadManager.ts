import { Client, Identity, ThreadID, Where } from '@textile/hub'
// @ts-ignore
import { Config } from '~/config'
import { TextileInitializationData } from '~/types/textile/manager'
import { MessageFromThread } from '~/types/textile/mailbox'
import { messageFromThread } from '~/libraries/Textile/encoders'
import { User } from '~/types/ui/user'

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
    await this.authorize()
    if (!this.textileClient || !this.identity) {
      return new Error(
        'Attempted to interface with a thread before initializing',
      )
    }
    const id = await this.fetchThread()
    if (id) {
      this.threadID = id
      return
    }
    this.threadID = await this.createThread()
  }

  async authorize(): Promise<null | any> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
      const client = await Client.withKeyInfo({
        // @ts-ignore
        key: Config.textile.key,
      })
      const token = await client.getToken(this.identity).catch((e) => {
        resolve(new Error("Couldn't connect to Textile.io"))
      })
      resolve({
        client,
        token,
      })
    })
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
    return this.threadID
  }

  async createNewChatCollection() {
    await this.textileClient.newCollectionFromObject(
      this.threadID,
      messageFromThread,
      {
        name: 'collectionName',
      },
    )
    await this.textileClient.create(this.threadID, 'collectionName', [
      messageFromThread,
    ])
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

  /**
   * @method
   * @name addUserToCollection
   * @argument threadTitle identifier to store the thread by
   * @argument values Values object Array containing update info
   */
  async addUserToCollection(
    collectionName: string,
    userName: string,
    newInfo: Array<any>,
  ) {
    const query = new Where('name').eq(userName)
    const result = await this.textileClient.find<User>(
      this.threadID,
      collectionName,
      query,
    )
    newInfo.forEach((user) => result.push(user))
    return await this.textileClient.save(this.threadID, collectionName, result)
  }

  async ensureCollection(collectionName: string, schema: any) {
    try {
      await this.textileClient.getCollectionIndexes(
        this.threadID,
        collectionName,
      )
    } catch (e) {
      await this.textileClient.newCollectionFromObject(this.threadID, schema, {
        name: collectionName,
      })
    }
  }

  async addNewMessage(
    collectionName: string,
    message: MessageFromThread,
  ): Promise<ThreadID> {
    await this.ensureCollection(collectionName, messageFromThread)
    await this.textileClient.create(this.threadID, collectionName, [message])
    return this.threadID
  }

  async getIndexes(name: string) {
    return await this.textileClient.getCollectionIndexes(this.threadID, name)
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

  /**
   * @method
   * @name threadMatches
   * Check to see if a local thread stored at an
   * identifier matches the expected thread id
   * @argument identifier identifier string of the thread to check
   * @argument expectedId the ThreadID we expect to see
   * @returns boolean value of if the stored ID matches the given ID
   */
  threadMatches(identifier: string, expectedId: string): boolean {
    const threadID = this.fetchThread()
    if (!threadID) return false
    return threadID.toString() === expectedId
  }

  /**
   * @method
   * @name threadAt
   * Fetch a thread from a given identifier
   * @argument identifier identifier string of the thread to fetch
   * @returns ThreadID object assigned to the idenifier
   */
  async threadAt(identifier: string): Promise<ThreadID> {
    const existingThreadID = this.fetchThread()

    if (existingThreadID) {
      const ex = ThreadID.fromString(existingThreadID.toString())
      return ex
    }
    return await this.fetchThread()
  }

  /**
   * @method
   * @name makeIdentifier
   * Make a identifier string given two targets
   * @argument a string value of the first party ID
   * @argument b string value of the second party ID
   * @returns new string identifier
   */
  makeIdentifier(a: string, b: string): string {
    return `${a}-${b}`
  }
}
