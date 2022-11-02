import { LocalNotifications } from '@capacitor/local-notifications'
import { EnvInfo } from './EnvInfo'
import { PlatformTypeEnum } from '~/libraries/Enums/enums'
import { Config } from '~/config'
import { Notification as NotificationType } from '~/libraries/Iridium/notifications/types'

const isSupported = (): boolean =>
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window

export const Notifications = class Notifications {
  currentPlatform: PlatformTypeEnum = PlatformTypeEnum.ANDROID
  notificationPermission: string = 'denied' // web: 'denied' 'granted' 'default'
  $Config: typeof Config = Config

  constructor() {
    const envinfo = new EnvInfo()
    this.currentPlatform = envinfo.currentPlatform

    if (this.currentPlatform === PlatformTypeEnum.ANDROID) {
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
  async requestNotificationPermission(): Promise<boolean> {
    if (
      (this.currentPlatform === PlatformTypeEnum.WEB ||
        this.currentPlatform === PlatformTypeEnum.ELECTRON) &&
      isSupported()
    ) {
      await Notification.requestPermission()
    }
    if (this.currentPlatform === PlatformTypeEnum.ANDROID) {
      // and maybe iOS?
      LocalNotifications.requestPermissions().then((result: any) => {
        return result
      })
    }
    return true
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
   * @param title
   * @param image
   * @param description
   * @example
   */
  async sendNotifications({
    type,
    title,
    image,
    description,
    onNotificationClick,
  }: NotificationType): Promise<void> {
    if (
      this.currentPlatform === PlatformTypeEnum.WEB ||
      this.currentPlatform === PlatformTypeEnum.ELECTRON
    ) {
      if (this.notificationPermission !== 'granted' && isSupported()) {
        Notification.requestPermission().then((result: any) => {
          this.notificationPermission = result
        })
      }

      // browser notification api
      const notification = new Notification(`${title}`, {
        tag: String(new Date().getTime()),
        body: description,
        icon: `${this.$Config.ipfs.gateway}${image}`,
        badge: `${this.$Config.ipfs.gateway}${image}`,
      })

      notification.onclick = (event: any) => {
        event.preventDefault()
        if (onNotificationClick) {
          onNotificationClick()
        }
        window.focus()
        notification.close()
      }
    }

    if (this.currentPlatform === PlatformTypeEnum.ANDROID) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body: description,
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
