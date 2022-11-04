import {
  LocalNotifications,
  RegisterActionTypesOptions,
} from '@capacitor/local-notifications'
import { EnvInfo } from './EnvInfo'
import { PlatformTypeEnum } from '~/libraries/Enums/enums'
import { Config } from '~/config'
import {
  ActionTypeIds,
  NotifActionHandler,
  NotifActionTypes,
  Notification,
  NotificationPayloads,
  NotificationType,
} from '~/libraries/Iridium/notifications/types'
import useNotifActionHandlers from '~~/components/compositions/useNotifActionHandlers'

const isSupported = (): boolean =>
  'Notification' in window &&
  'serviceWorker' in navigator &&
  'PushManager' in window

const MOBILE_NOTIF_DELAY = 1000

const MOBILE_ACTION_TYPES: RegisterActionTypesOptions = {
  types: [
    {
      id: ActionTypeIds.CALL_INCOMING,
      actions: [
        // TODO
        // {
        //   id: 'accept',
        //   title: 'Accept',
        //   destructive: true,
        // },
        // {
        //   id: 'decline',
        //   title: 'Decline',
        //   input: true,
        // },
      ],
    },
    {
      id: ActionTypeIds.DEFAULT,
      actions: [],
    },
    {
      id: ActionTypeIds.FRIEND_REQUEST,
      actions: [
        {
          id: 'accept',
          title: 'Accept',
        },
        {
          id: 'decline',
          title: 'Decline',
        },
      ],
    },
    {
      id: ActionTypeIds.MESSAGE,
      actions: [
        {
          id: 'respond',
          title: 'Respond',
          input: true,
        },
      ],
    },
  ],
}
export const Notifications = class Notifications {
  currentPlatform: PlatformTypeEnum = PlatformTypeEnum.ANDROID
  notificationPermission: string = 'denied' // web: 'denied' 'granted' 'default'
  $Config: typeof Config = Config

  constructor() {
    const envinfo = new EnvInfo()
    this.currentPlatform = envinfo.currentPlatform

    if (
      this.currentPlatform === PlatformTypeEnum.ANDROID ||
      this.currentPlatform === PlatformTypeEnum.IOS
    ) {
      // These are shown in the notification as options the user can interact with outside of the app
      LocalNotifications.registerActionTypes(MOBILE_ACTION_TYPES)

      // This notification channel allows the notification to be sent and pop over the screen and other apps
      if (this.currentPlatform === PlatformTypeEnum.ANDROID) {
        LocalNotifications.createChannel({
          id: 'pop-notifications',
          name: 'Pop notifications',
          description: 'Pop notifications',
          importance: 5,
          visibility: 1,
        })
      }
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
    if (
      this.currentPlatform === PlatformTypeEnum.ANDROID ||
      this.currentPlatform === PlatformTypeEnum.IOS
    ) {
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

  getActionTypeId = (type: NotificationType): ActionTypeIds => {
    switch (type) {
      case NotificationType.CALL_INCOMING:
        return ActionTypeIds.CALL_INCOMING

      case NotificationType.FRIEND_REQUEST:
        return ActionTypeIds.FRIEND_REQUEST

      case NotificationType.DIRECT_MESSAGE:
      case NotificationType.GROUP_MESSAGE:
      case NotificationType.MENTION:
      case NotificationType.MEMBER_JOIN:
      case NotificationType.MEMBER_LEAVE:
      case NotificationType.ADDED_TO_GROUP:
      case NotificationType.GROUP_CONVERSATION_CREATED:
        return ActionTypeIds.MESSAGE

      default:
        return ActionTypeIds.DEFAULT
    }
  }

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
    payload,
  }: Notification): Promise<void> {
    if (
      this.currentPlatform === PlatformTypeEnum.WEB ||
      this.currentPlatform === PlatformTypeEnum.ELECTRON
    ) {
      if (this.notificationPermission !== 'granted' && isSupported()) {
        Notification.requestPermission().then((result) => {
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
        const { notifActionHandlers } = useNotifActionHandlers()

        const notifActionHandler = notifActionHandlers[
          ActionTypeIds.MESSAGE
        ] as NotifActionHandler<NotificationPayloads>

        if (notifActionHandler) {
          const handler = notifActionHandler[NotifActionTypes.TAP]

          if (handler) {
            handler(payload as NotificationPayloads)
          }
        }

        window.focus()
        notification.close()
      }
    }

    if (
      this.currentPlatform === PlatformTypeEnum.ANDROID ||
      this.currentPlatform === PlatformTypeEnum.IOS
    ) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title,
            body: description,
            id: new Date().getTime(),
            extra: payload,
            schedule: {
              at: new Date(new Date().getTime() + MOBILE_NOTIF_DELAY),
              allowWhileIdle: true,
            },
            actionTypeId: this.getActionTypeId(type),
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
