import {
  Emitter,
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium/dist/index.browser'
import type { EmitterCallback } from '@satellite-im/iridium/src/emitter'
import { Alert, AlertState, AlertType } from '~/libraries/ui/Alerts'
import { IridiumManager } from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'
import { NotificationsError } from '~/libraries/Iridium/notifications/types'

export default class NotificationManager extends Emitter<Notification> {
  public ready: boolean = false
  public subscriptions: string[] = []
  public state: {
    notifications: []
    notification: { [key: string]: Notification }
  } = {
    notifications: [],
    notification: {},
  }

  constructor(public readonly iridium: IridiumManager) {
    super()
  }

  async init() {
    await this.fetch()

    await Promise.all(
      this.state.notifications.map(async (notification) => {
        this.iridium.connector?.on(
          `/notifications/${notification}`,
          this.state.notifications.push(notification),
        )
        await this.iridium.connector?.subscribe(`/notifications`)
      }),
    )

    this.ready = true
    this.emit('ready', {})
  }

  async fetch() {
    this.state = await this.iridium.connector?.get('/notifications')
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
      `/notifications${path === '/' ? '' : path}`,
      payload,
      options,
    )
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
  }) {
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
    const notificationCID = await this.iridium.connector.store(
      buildNotification,
      {
        encrypt: { buildNotification },
      },
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
