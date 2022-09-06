import Vue from 'vue'
import {
  Emitter,
  EmitterCallback,
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium'
import iridium from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'
import {
  Notification,
  NotificationsError,
} from '~/libraries/Iridium/notifications/types'
import { Notifications } from '~/utilities/Notifications'

export default class NotificationManager extends Emitter<Notification> {
  public ready: boolean = false
  public subscriptions: string[] = []
  public state: {
    notifications: Notification[]
  } = {
    notifications: [],
  }

  async init() {
    await this.fetch()
    this.ready = true
    this.emit('ready', {})
  }

  async fetch() {
    logger.info('iridium/notifications/fetch', 'fetching')
    const fetched = await iridium.connector?.get<{
      notifications: Notification[]
    }>('notifications')
    if (fetched) {
      this.state.notifications = Array.isArray(fetched.notifications)
        ? fetched.notifications
        : fetched.notifications
        ? Object.values(fetched.notifications)
        : []
    }
    logger.info('iridium/notifications/fetch', 'fetched', this.state)
  }

  get list(): Notification[] {
    return Object.values(this.state.notifications)
  }

  get(path: string, options: IridiumGetOptions = {}) {
    return iridium.connector?.get(
      `/notifications${path === '/' ? '' : path}`,
      options,
    )
  }

  async set(path: string, payload: any, options: IridiumSetOptions = {}) {
    logger.info('iridium/notifications', 'path and paylaod', {
      path,
      payload,
    })
    await iridium.connector?.set(
      `/notifications${path === '/' ? '' : path}`,
      payload,
      options,
    )
    await this.fetch()
  }

  async seenAll() {
    this.state.notifications = this.state.notifications.map(
      (a: Notification) => {
        a.seen = true
        return a
      },
    )
    await this.save()
  }

  async subscribeToNotifications(
    id: string,
    onNotification: EmitterCallback<Notification>,
  ) {
    await this.fetch()
    this.on(`notifications`, onNotification)
  }

  async unsubscribeFromConversation(
    id: string,
    onNotification: EmitterCallback<Notification>,
  ) {
    this.off(`notifications`, onNotification)
  }

  async save() {
    await this.set('/notifications', this.state.notifications)
  }

  async deleteNotification(id: string) {
    this.state.notifications = this.state.notifications.filter(
      (n) => n.id !== id,
    )
    await this.save()
  }

  async deleteAll() {
    this.state.notifications = []
    await this.save()
  }

  /**
   * Send a new notification
   * @method sendNotification
   */
  async sendNotification(notification: Exclude<Notification, 'id'>) {
    if (!iridium.connector) return
    const notificationID = await iridium.connector.store(notification, {})
    if (!notificationID) {
      throw new Error(NotificationsError.NOTIFICATION_NOT_SENT)
    }
    notification.id = notificationID.toString()
    this.state.notifications = [...this.state.notifications, notification]
    await this.save()

    this.emit(`notifications/send`, {
      notification,
      from: iridium.connector.did,
    })
    const browserNotification = new Notifications()
    await browserNotification.sendNotifications(
      notification.type!,
      notification.title!,
      notification.image!,
      notification.description!,
    )
  }
}
