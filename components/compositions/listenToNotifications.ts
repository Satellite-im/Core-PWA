import { LocalNotifications } from '@capacitor/local-notifications'
import {
  NotificationBase,
  NotificationPayloads,
  NotificationTypeValues,
  ActionTypeIds,
  NotifActionHandler,
  NotifActionTypes,
} from '~/libraries/Iridium/notifications/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { EnvInfo } from '~~/utilities/EnvInfo'
import { PlatformTypeEnum } from '~~/libraries/Enums/enums'
import useNotifActionHandlers from '~~/components/compositions/useNotifActionHandlers'
import useNotifCreateHandlers from '~~/components/compositions/useNotifCreateHandlers'

export function listenToNotifications() {
  const envinfo = new EnvInfo()
  const { notifActionHandlers } = useNotifActionHandlers()

  // Listen for incoming notifications and handle them in the app
  iridium.notifications.on(
    'notification/create',
    (notification: NotificationBase<keyof NotificationTypeValues>) => {
      const { notifCreateHandlers } = useNotifCreateHandlers()
      const notifCreateHandler = notifCreateHandlers[notification.type].handler

      if (notifCreateHandler) {
        notifCreateHandler(notification)
      }
    },
  )

  // Listen to notification actions on Android devices (e.g. when the user clicks on a notification action)
  if (
    envinfo.currentPlatform === PlatformTypeEnum.ANDROID ||
    envinfo.currentPlatform === PlatformTypeEnum.IOS
  ) {
    LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notif) => {
        const actionTypeId = notif.notification.actionTypeId as ActionTypeIds
        const notifActionHandler = notifActionHandlers[
          actionTypeId
        ] as NotifActionHandler<NotificationPayloads>

        if (notifActionHandler) {
          const actionId = notif.actionId as NotifActionTypes
          const handler = notifActionHandler[actionId]

          if (handler) {
            handler(
              notif.notification.extra as NotificationPayloads,
              notif.inputValue,
            )
          }
        }
      },
    )
  }
}
