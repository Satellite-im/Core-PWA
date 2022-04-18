import { NotificationTypes } from '~/libraries/Enums/types/notification-types'

export type AppNotification = {
  id: String
  message: String
  seen: Boolean
  from: String
  to: String
  type: NotificationTypes
  date: Number
}

export type Notifications = {
  userId: String
  seenAll: Boolean
  unseenCount: Number
  allNotifications: Array<AppNotification>
}
