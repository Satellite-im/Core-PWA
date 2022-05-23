import { EnvInfo } from './EnvInfo'
import { PlatformTypeEnum } from '~/libraries/Enums/enums'

const isSupported = (): boolean =>
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window

export const Notifications = class Notifications {
  currentPlatform: PlatformTypeEnum = PlatformTypeEnum.ANDROID
  notificationPermission: string = 'denied' // web: 'denied' 'granted' 'default'
  sendNotification: any = this.sendNotifications

  constructor() {
    const envinfo = new EnvInfo()
    this.currentPlatform = envinfo.currentPlatform
    if (this.currentPlatform === PlatformTypeEnum.WEB) {
      // all mount needs for web/pwa
      if (this.notificationPermission !== 'granted' && isSupported()) {
        Notification.requestPermission().then((result: any) => {
          this.notificationPermission = result
        })
      }
    }
  }

  /**
   * @method requestNotificationPermission DocsTODO
   * @description
   * @returns
   * @example
   */
  requestNotificationPermission(): any {
    if (
      (this.currentPlatform === PlatformTypeEnum.WEB ||
        this.currentPlatform === PlatformTypeEnum.ELECTRON) &&
      isSupported()
    ) {
      Notification.requestPermission()
    }
  }

  /**
   * @method sendNotifications DocsTODO
   * @description
   * @param type
   * @param titleText
   * @param message
   * @example
   */
  async sendNotifications(
    type: string,
    titleText: string,
    message: string,
  ): Promise<void> {
    if (
      this.currentPlatform === PlatformTypeEnum.WEB ||
      this.currentPlatform === PlatformTypeEnum.ELECTRON
    ) {
      // browser notification api
      await new Notification(type, {
        tag: titleText,
        body: message,
      })
    }
  }
}
