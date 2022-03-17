import { LocalNotifications } from '@capacitor/local-notifications'
import { EnvInfo } from './EnvInfo'

const isSupported = (): boolean =>
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window

export const Notifications = class Notifications {
  currentPlatform: string = 'android' // 'iOS', 'android', 'web'
  notificationPermission: string = 'denied' // web: 'denied' 'granted' 'default'
  sendNotification: any = this.sendNotifications

  constructor() {
    const envinfo = new EnvInfo()
    this.currentPlatform = envinfo.currentPlatform // ios, web, android
    if (this.currentPlatform === 'web') {
      // all mount needs for web/pwa
      if (this.notificationPermission !== 'granted' && isSupported()) {
        Notification.requestPermission().then((result: any) => {
          this.notificationPermission = result
        })
      }
    }

    if (this.currentPlatform === 'android') {
      // These are shown in the notification as options the user can interact with outside of the app
      LocalNotifications.registerActionTypes({
        types: [
          {
            id: 'CHAT_MESSAGE',
            actions: [
              {
                id: 'view',
                title: 'View',
              },
              {
                id: 'dismiss',
                title: 'Dismiss',
                destructive: true,
              },
              {
                id: 'respond',
                title: 'Respond',
                input: true,
              },
            ],
          },
        ],
      })

      // This notification channel allows the notification to be sent and pop over the screen and other apps
      LocalNotifications.createChannel({
        id: 'pop-notifications',
        name: 'Pop notifications',
        description: 'Pop notifications',
        importance: 5,
        visibility: 1,
      })
    }
  }

  /**
   * @method registerNotificationWatch DocsTODO
   * @description
   * @returns
   * @example
   */
  registerNotificationWatch(): any {
    return LocalNotifications.addListener(
      'localNotificationReceived',
      (notification: any) => {
        return notification
      },
    )
  }

  /**
   * @method requestNotificationPermission DocsTODO
   * @description
   * @returns
   * @example
   */
  requestNotificationPermission(): any {
    if (
      (this.currentPlatform === 'web' || this.currentPlatform === 'electron') &&
      isSupported()
    ) {
      Notification.requestPermission()
    }
    if (this.currentPlatform === 'android') {
      // and maybe iOS?
      LocalNotifications.requestPermissions().then((result: any) => {
        return result
      })
    }
  }

  /* Not sure if this section will be needed yet - in web and android it is not
   revokeNotificationPermission(): void {
     if (this.currentPlatform === 'web' || this.currentPlatform === 'electron') {
        // Notification api for web doesn't let us revoke, has to happen in browser
     }
     if (this.currentPlatform === 'android') {
        // do something, android doesnt seem to require us asking
        ;(LocalNotifications as any).requestPermissions().then((result: any) => {
        LocalNotifications.register()
          alert(result)
        })
     }
   } */

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
    if (this.currentPlatform === 'web' || this.currentPlatform === 'electron') {
      // browser notification api
      await new Notification(type, {
        tag: titleText,
        body: message,
      })
    }

    if (this.currentPlatform === 'android') {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: titleText,
            body: message,
            id: new Date().getTime(),
            schedule: {
              at: new Date(new Date().getTime() + 3000),
              allowWhileIdle: true,
            },
            actionTypeId: 'CHAT_MESSAGE',
            extra: null,
            attachments: [
              {
                id: 'face',
                url: 'res://ic_launcher.png',
              },
            ],
            channelId: 'pop-notifications',
          },
        ],
      })
    }
  }
}
