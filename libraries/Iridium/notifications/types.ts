export type Notification = {
  id: string
  type: string
  from: string
  to: string
  body: string
  at: number
  read: boolean
}

export const NotificationsError = {
  NOTIFICATION_NOT_SENT: 'error.notifications.notifications_not_sent',
}

export enum NotificationType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  MISSED_CALL = 'MISSED_CALL',
  FILES_FULL = 'FILES_FULL',
  FILE_UPLOADED = 'FILE_UPLOADED',
  FILE_NSFW = 'FILE_NSFW',
  APP_NOTIFICATION = 'APP_NOTIFICATION',
  DEV = 'DEV',
  DIRECT_MESSAGE = 'Direct Message',
  GROUP_MESSAGE = 'Group Message',
  MENTIONS_NOTIFICATION = 'mentionNotification',
  ACCOUNT_NOTIFICATION = 'accountNotification',
  APPLICATION_NOTIFICATION = 'applicationNotification',
  MISCELLANEOUS = 'miscellaneous',
}

export type Alert = {
  at: number
  id?: string
  type: NotificationType
  fromName: string
  fromAddress?: string
  groupName?: string
  groupId?: string
  content: {
    title: string
    description: string
    image?: string
  }
}
