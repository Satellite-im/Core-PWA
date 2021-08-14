import { Capacitor } from '@capacitor/core'
import { LocalNotifications } from '@capacitor/local-notifications'
// import { Notification as ElectronNotification } from 'electron'
// import { PushNotifications } from '@capacitor/push-notifications'

// export interface LocalNotificationSchedule {
//   at?: Date
//   repeats?: boolean
//   every?:
//     | 'year'
//     | 'month'
//     | 'two-weeks'
//     | 'week'
//     | 'day'
//     | 'hour'
//     | 'minute'
//     | 'second'
//   count?: number
//   on?: {
//     year?: number
//     month?: number
//     day?: number
//     hour?: number
//     minute?: number
//   }
// }

export const Notifications = class Notifications {
  currentPlatform: string = 'android' // 'ios', 'android', 'web'
  notificationPermission: string = 'denied' // web: 'denied' 'granted' 'default'
  sendNotification: any = this.sendNotifications

  constructor() {
    this.currentPlatform = Capacitor.getPlatform() // ios, web, android
    if (this.currentPlatform === 'web') {
      // all mount needs for web/pwa
      if (this.notificationPermission !== 'granted') {
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

  registerNotificationWatch(): any {
    return LocalNotifications.addListener(
      'localNotificationReceived',
      (notification: any) => {
        console.log('we got it', notification)
        return notification
      }
    )
  }

  requestNotificationPermission(): any {
    // @ts-ignore
    if (this.currentPlatform === 'web' || this.currentPlatform === 'electron') {
      Notification.requestPermission()
    }
    if (this.currentPlatform === 'android') {
      // and ios?
      // and maybe ios?
      // do something
      LocalNotifications.requestPermissions().then((result: any) => {
        // LocalNotifications.register()
        return result
      })
    }
  }

  revokeNotificationPermission(): void {
    if (this.currentPlatform === 'web' || this.currentPlatform === 'electron') {
      // Notification api for web doesn't let us revoke, has to happen in browser
    }
    if (this.currentPlatform === 'android') {
      // do something, android doesnt seem to require us asking
      // ;(LocalNotifications as any).requestPermissions().then((result: any) => {
      //   // LocalNotifications.register()
      //   alert(result)
      // })
    }
  }

  async sendNotifications(
    type: string,
    titleText: string,
    message: string
  ): Promise<void> {
    if (this.currentPlatform === 'web' || this.currentPlatform === 'electron') {
      // browser notification api
      await new Notification(type, {
        tag: titleText,
        body: message,
      })
    }
    // if (this.currentPlatform === 'electron') {
    //   // When we copy/sync the project to electron we switch to the electron verison of the notification api
    //   // This allows us to not have 'Electron' in the os native notification window
    //   // @ts-ignore
    //   new Notification({
    //     title: titleText,
    //     body: message,
    //     // @ts-ignore
    //   }).show()
    // }
    if (
      this.currentPlatform === 'android'
      // this.currentPlatform === 'electron'
    ) {
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
