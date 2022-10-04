import { type } from 'os'
import { User } from '~/libraries/Iridium/users/types'

export const NotificationsError = {
  NOTIFICATION_NOT_SENT: 'error.notifications.notifications_not_sent',
}

export enum NotificationType {
  FRIEND_REQUEST,
  MISSED_CALL,
  FILES_FULL,
  FILE_UPLOADED,
  FILE_NSFW,
  DEV,
  DIRECT_MESSAGE,
  GROUP_MESSAGE,
  MENTIONS_NOTIFICATION,
  ACCOUNT_NOTIFICATION,
  APPLICATION_NOTIFICATION,
  MISCELLANEOUS,
  SEEN,
}

export type Notification = {
  at: number
  type: NotificationType
  fromName: string
  title: string
  description: string
  seen: boolean
  id?: string
  chatName?: string
  fromAddress?: string
  image?: string
  onNotificationClick?: () => void
}

export type NotificationBase = {
  type: NotificationType
  title: string
  description: string
  fromName: string
  at?: number
  image?: string
  titleValues?: object
  descriptionValues?: object
  onNotificationClick?: void
  notificationClickParams?: object
}

export type NotificationClickEvent = {
  from: string
  topic: string
  payload: { type: NotificationType }
}

export const EmptyNotification: Notification = {
  at: 0,
  id: '',
  type: NotificationType.SEEN,
  fromName: '',
  fromAddress: '',
  title: '',
  description: '',
  image: '',
  seen: false,
}
