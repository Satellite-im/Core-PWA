import {
  IridiumPeerMessage,
  IridiumPubsubEvent,
  Iridium,
  Emitter,
  EmitterCallback,
  IridiumSetOptions,
  IridiumGetOptions,
} from '@satellite-im/iridium'
import { Alert, AlertState, AlertType } from '~/libraries/ui/Alerts'
import { IridiumManager } from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'
import { NotificationsError } from '~/libraries/Iridium/notifications/types'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default class NotificationManager extends Emitter<Alert> {
  public ready: boolean = false
  public subscriptions: string[] = []
  public state: {
    notifications: string[]
    notification: { [key: string]: Alert }
  } = {
    notifications: [],
    notification: {},
  }

  constructor(public readonly iridium: IridiumManager) {
    super()
  }

  async init() {
    await this.fetch()
    // await Promise.all(
    //   this.state.notifications.map(async (notification) => {
    //     this.iridium.connector?.on(
    //       `notifications/${notification}`,
    //       this.onNotificationActivity.bind(notification),
    //     )
    //     await this.iridium.connector?.subscribe(`/notifications`)
    //   }),
    // )
    this.ready = true
    this.emit('ready', {})
  }

  async fetch() {
    this.state = (await this.iridium.connector?.get('notifications')) || {
      notifications: [],
      notification: {},
    }
  }

  get(path: string, options: IridiumGetOptions = {}) {
    return this.iridium.connector?.get(
      `/notifications${path === '/' ? '' : path}`,
      options,
    )
  }

  set(path: string, payload: any, options: IridiumSetOptions = {}) {
    logger.info('iridium/notifications', 'path and paylaod', {
      path,
      payload,
    })
    return this.iridium.connector?.set(
      `/${path === '/' ? '' : path}`,
      payload,
      options,
    )
  }

  private async onNotificationActivity(notificationID: string) {
    if (!this.iridium.connector) return
    const noti = await this.iridium.connector.load(notificationID, {
      decrypt: true,
    })
    if (noti) {
      this.state.notifications.push(noti)
      await this.iridium.connector?.set(`notifications/${noti}`, noti)
    }
    this.emit(`notifications/${noti}`, noti)
  }

  async subscribeToNotifications(
    id: string,
    onNotification: EmitterCallback<Notification>,
  ) {
    this.on(`notifications`, onNotification)
  }

  async unsubscribeFromConversation(
    id: string,
    onNotification: EmitterCallback<Notification>,
  ) {
    this.off(`notifications`, onNotification)
  }

  /**
   * Send a new notification
   * @method sendNotification
   * @returns returns the textile response
   */
  async sendNotification(payload: {
    from?: string
    message?: string
    imageHash?: string
    type?: AlertType
    seen?: boolean
    title?: string
    fromAddress?: string
    groupName?: string
    groupId?: string
  }) {
    const buildNotification: Alert = {
      content: {
        title: payload.title,
        image: payload.imageHash,
        description: payload.message,
      },
      seen: payload.seen,
      fromName: payload.from || '',
      fromAddress: payload.fromAddress || '',
      groupName: payload.groupName || '',
      groupId: payload.groupId || '',
      type: payload.type,
      at: Date.now(),
    }
    if (!this.iridium.connector) return
    const notificationCID = await this.iridium.connector.store(
      buildNotification,
      {},
    )
    if (!notificationCID) {
      throw new Error(NotificationsError.NOTIFICATION_NOT_SENT)
    }
    await this.iridium.connector.set(
      `/notifications/${notificationCID}`,
      buildNotification,
    )
    await this.iridium.connector.broadcast(
      `/notifications/${notificationCID}`,
      {
        action: 'notification',
        notification: buildNotification,
      },
    )
    this.emit(`notifications/${notificationCID}`, {
      action: 'notification',
      message: buildNotification,
      from: this.iridium.connector.did,
    })
  }
}
