import { Query, ThreadID, Update } from '@textile/hub'
import { notificationSchema } from '~/libraries/Textile/schema'
import { TextileInitializationData } from '~/types/textile/manager'
import { Alert, AlertState, AlertType } from '~/libraries/ui/Alerts'
import { Notifications } from '~/utilities/Notifications'
const CollectionName = 'notification'

export class NotificationManager {
  private threadId?: ThreadID
  textile: TextileInitializationData
  listeners: {
    notifications?: (
      notification?: Update<any> | undefined,
      err?: Error | undefined,
    ) => void
  }

  constructor(textile: TextileInitializationData) {
    this.textile = textile
    this.listeners = {}
  }

  /**
   * @method init
   * Initialize the NotificationManager
   */
  async init() {
    this.threadId = await this.getThreadID()
    await this.getnotifications()
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
    from: string
    id: string
    message: string
    imageHash: string
    type: AlertType
    fromAddress?: string
    groupName?: string
    groupId?: string
    notificationState: AlertState
    title: string
  }): Promise<Object | null> {
    const buildNotification: Alert = {
      content: {
        title: payload.title,
        image: payload.imageHash,
        description: payload.message,
      },
      state: payload.notificationState,
      fromName: payload.from,
      fromAddress: payload.fromAddress,
      groupName: payload.groupName,
      groupId: payload.groupId,
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
    const makeNotificationMessage = `New message from ${payload.from}`

    const browserNotification = new Notifications()
    await browserNotification.sendNotifications(
      payload.type,
      payload.title,
      payload.imageHash,
      makeNotificationMessage,
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
