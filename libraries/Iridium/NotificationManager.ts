import {
  Emitter,
  EmitterCallback,
  IridiumGetOptions,
  IridiumSetOptions,
} from '@satellite-im/iridium'
import { IridiumManager } from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'
import {
  EmptyNotification,
  Notification,
  NotificationsError,
  NotificationType,
} from '~/libraries/Iridium/notifications/types'
import { Notifications } from '~/utilities/Notifications'

export default class NotificationManager extends Emitter<Notification> {
  public ready: boolean = false
  public subscriptions: string[] = []
  public state: {
    notifications: [{ [key: string]: Notification }]
  } = {
    notifications: [{}],
  }

  constructor(public readonly iridium: IridiumManager) {
    super()
  }

  async init() {
    await this.fetch()
    this.ready = true
    this.emit('ready', {})
  }

  async fetch() {
    this.state = (await this.iridium.connector?.get('notifications')) || {
      notifications: [{}],
    }
    // if (!this.state.notifications) {
    //   return
    // }
    // this.state.notifications.map((a) => {
    //   return a[1].type !== NotificationType.EMPTY
    // })
    // console.log(this.state.notifications, 'asdffffffffffffffffffffffffff')
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

  async filterDeletedNotifications(): Promise<[{ [p: string]: Notification }]> {
    this.state = (await this.iridium.connector?.get('notifications')) || {
      notifications: [{}],
    }
    return this.state.notifications.sort((a: any, b: any) => {
      return b.at - a.at
    })
    // .filter((noti: any) => {
    //   console.log(noti)
    //   return noti.type !== NotificationType.EMPTY
    // })
  }

  async seenAll() {
    this.state.notifications.forEach((a) => {
      a[1].seen = true
      this.iridium.connector?.set(`/notifications/${a[0]}`, a[1])
    })
  }

  // private async onNotificationActivity(notificationID: string) {
  //   if (!this.iridium.connector) return
  //   const noti = await this.iridium.connector.load(notificationID, {
  //     decrypt: true,
  //   })
  //   if (noti) {
  //     this.state.notifications.push(noti)
  //     await this.iridium.connector?.set(`notifications/${noti}`, noti)
  //   }
  //   this.emit(`notifications/${noti}`, noti)
  // }

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

  async deleteNotification(Id: string) {
    await this.iridium.connector?.set(`/notifications/${Id}`, EmptyNotification)
  }

  /**
   * Send a new notification
   * @method sendNotification
   * @returns returns the textile response
   */
  async sendNotification(payload: Partial<Notification>) {
    if (!this.iridium.connector) return
    const notificationCID = await this.iridium.connector.store(payload, {})
    if (!notificationCID) {
      throw new Error(NotificationsError.NOTIFICATION_NOT_SENT)
    }
    await this.iridium.connector.set(
      `/notifications/${notificationCID}`,
      payload,
    )

    // const buildNotification: Partial<Notification> = {
    //   fromName: friendUser?.name,
    //   at: Date.now(),
    //   fromAddress: conversationId,
    //   title: `New message from ${friendUser?.name}`,
    //   description:
    //     msg.body.length > 79 ? `${msg.body.substring(0, 80)}...` : msg.body,
    //   image: friendUser?.photoHash,
    //   type: NotificationType.DIRECT_MESSAGE,
    //   seen: false,
    // }
    // console.log(buildNotification)
    // this.iridium.notifications?.sendNotification(buildNotification)
    // await this.iridium.connector.broadcast(
    //   `/notifications/${notificationCID}`,
    //   {
    //     action: 'notification',
    //     notification: payload,
    //   },
    // )
    this.emit(`notifications/${notificationCID}`, {
      action: 'notification',
      message: payload,
      from: this.iridium.connector.did,
    })
    const browserNotification = new Notifications()
    await browserNotification.sendNotifications(
      payload.type!,
      payload.title!,
      payload.image!,
      payload.description!,
    )
  }
}
