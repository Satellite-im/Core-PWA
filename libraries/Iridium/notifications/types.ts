// export type Notification = {
//   id: string
//   type: string
//   from: string
//   to: string
//   body: string
//   at: number
//   read: boolean
// }

export const NotificationsError = {
  NOTIFICATION_NOT_SENT: 'error.notifications.notifications_not_sent',
}

export enum NotificationType {
  FRIEND_REQUEST = 'Friend Request',
  MISSED_CALL = 'MISSED_CALL',
  FILES_FULL = 'FILES_FULL',
  FILE_UPLOADED = 'FILE_UPLOADED',
  FILE_NSFW = 'FILE_NSFW',
  DEV = 'DEV',
  DIRECT_MESSAGE = 'Direct Message',
  GROUP_MESSAGE = 'Group Message',
  MENTIONS_NOTIFICATION = 'mentionNotification',
  ACCOUNT_NOTIFICATION = 'accountNotification',
  APPLICATION_NOTIFICATION = 'applicationNotification',
  MISCELLANEOUS = 'miscellaneous',
}

export type Notification = {
  at: number
  id?: string
  type: NotificationType
  fromName: string
  fromAddress?: string
  title: string
  description: string
  image?: string
  seen: boolean
}
