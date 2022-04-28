import { Identity, PrivateKey, Query, ThreadID, Update } from '@textile/hub'
import { notificationSchema } from '~/libraries/Textile/schema'
import { TextileInitializationData } from '~/types/textile/manager'
import { Alert, AlertState, AlertType } from '~/libraries/ui/Alerts'

const CollectionName = 'notification'

export class NotificationManager {
  private threadId?: ThreadID
  textile: TextileInitializationData
  identity: Identity
  listeners: {
    notifications?: (
      notification?: Update<any> | undefined,
      err?: Error | undefined,
    ) => void
  }

  constructor(textile: TextileInitializationData, identity: Identity) {
    this.identity = identity
    this.textile = textile
    this.listeners = {}
  }

  /**
   * @method init
   * Initialize the NotificationManager
   */
  async init() {
    this.threadId = await this.getThreadID()
  }

  /**
   * @method isInitialized
   * @description Checks if the mailbox is initialized for the current user
   * @returns true | false
   */
  isInitialized() {
    return this.threadId !== null
  }

  private async initNotificationsDB(): Promise<ThreadID> {
    this.threadId = await this.textile.client.newDB(undefined, 'notifications')
    try {
      await this.textile.client.newCollection(this.threadID, {
        name: CollectionName,
        schema: notificationSchema,
      })
    } catch (e) {}
    return this.threadId
  }

  get threadID() {
    if (!this.threadId) {
      throw new Error('GroupChatManager not initialized')
    }
    return this.threadId
  }

  /**
   * Get the current user's metadata identified by `to` and `key`
   * @returns returns the current user's metadata
   */
  async getnotifications(): Promise<Object | null> {
    const query = Query.where('from').eq(this.textile.wallet.address)
    return await this.textile.client.find<Alert>(
      this.threadID,
      CollectionName,
      query,
    )
  }

  /**
   * Send a new notification
   * @method sendNotification
   * @returns returns the textile response
   */
  async sendNotification(payload: {
    from: String
    id: string
    message: string
    imageHash: string
    type: AlertType
    title: string
  }): Promise<Object | null> {
    const buildNotification: Alert = {
      content: {
        title: payload.title,
        image: payload.imageHash,
        description: payload.message,
      },
      state: AlertState.UNREAD,
      type: payload.type,
      at: Date.now(),
      id: payload.id,
    }
    if (!this.threadId) {
      throw new Error('Manager not initialized')
    }
    const notificationId = await this.textile.client.create(
      this.threadID,
      CollectionName,
      [buildNotification],
    )
    const notification = await this.textile.client.find<Alert>(
      this.threadId,
      CollectionName,
      Query.where('_id').eq(notificationId[0]),
    )
    return notification[0]
  }

  async getThreadID(): Promise<ThreadID> {
    const name = 'notifications'
    try {
      const thread = await this.textile.client.getThread(name)
      // await this.getnotifications()
      return ThreadID.fromString(thread.id)
    } catch (e) {
      return this.initNotificationsDB()
    }
  }
}
