import { Client, Identity, ThreadID } from '@textile/hub'
// @ts-ignore
import { Config } from '~/config'
import { TextileInitializationData } from '~/types/textile/manager'
import { User } from '~/types/ui/user'

export default class ThreadManager {
  textile: TextileInitializationData
  identity: Identity
  threadID: ThreadID | null
  token: string | null
  textileClient: Client

  /** @constructor
   * Construct a ThreadManager
   * The thread manager stores and fetches threads to store
   * arbitrary data between two peers
   * @argument storageMethod preffered storage method of thread assignment (LocalStorage)
   * @argument textileClient reference to the authenticated textile client
   */
  constructor(textile: TextileInitializationData, senderAddress: string, identity: Identity) {
    this.identity = identity
    this.textile = textile
    this.threadID = null
    this.token = null
    this.textileClient = textile.client
    this.identity = identity
  }

  async init() {
    await this.authorize()

  }

  async setupDB(threadName: string, threadUsers: string[], threadID: ThreadID, options?: Object) {
    // const thread = await this.textile.users.getThread(threadName)
    // const threadID = ThreadID.fromString(thread.id)
    await this.textileClient.newCollectionFromObject(threadID, { threadUsers, options }, { name: "threadName" })
    await this.textileClient.create(threadID, threadName, [{ threadUsers, options }])

    return threadID
  }

  async authorize(): Promise<null | any> {
    return new Promise(async (resolve) => {
      const client =
        await Client.withKeyInfo({
          // @ts-ignore
          key: Config.textile.key,
        })
      const token = await client.getToken(this.identity).catch((e) => {
        resolve(new Error('Couldn\'t connect to Textile.io'))
      })
      resolve({
        client,
        token,
      })
    })
  }

  async getCreateThread(threadUsers: string[], threadTitle?: string, options?: Object ) {
    if (!this.textileClient) return new Error('Attempted to interface with a thread before initalizing')
    // const thread = await this.textileClient.listThreads()
    // if (!thread || threadTitle === undefined) {
    const thread = await this.textile.users.getThread('hubmail')
    const threadID = ThreadID.fromString(thread.id)
      // this.threadID = await this.textileClient.newDB(
      //   undefined,
      //   threadTitle || '' + Date.now(),
      // )
      await this.setupDB(threadTitle  || '', threadUsers, threadID, options)
    // }
    // if (thread) {
    //   if (threadTitle != null) {
    //     const thread = await this.textile.users.getThread(threadTitle)
    //     return ThreadID.fromString(thread.id)
    //   }
    // }
  }

  /**
   * @method
   * @name updateThread
   * @argument identifier identifier to store the thread by
   * @argument threadID ThreadID object to store ID of
   */
  async updateThread(identifier: string, threadID: ThreadID, values: Array<any>) {
    await this.textileClient.save(threadID, identifier, values)
  }

  /**
   * @method
   * @name fetchThread
   * Fetch a thread ID from our storage method
   * @argument identifier identifier string of the thread to fetch
   * @returns string ID of the thread
   */
  async fetchThread(identifier: string): Promise<ThreadID> {
    const thread = await this.textile.users.getThread(identifier)
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
    const threadID = this.fetchThread(identifier)
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
    const existingThreadID = this.fetchThread(identifier)

    if (existingThreadID) {
      const ex = ThreadID.fromString(
        existingThreadID.toString(),
      )
      return ex
    }
    return await this.fetchThread(identifier)
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
