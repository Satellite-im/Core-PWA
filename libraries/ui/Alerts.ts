export enum AlertType {
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  MISSED_CALL = 'Missed Call',
  INCOMING_CALL = 'Incoming Call',
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
export enum AlertTitle {
  FRIEND_REQUEST = 'New Friend Request',
  DIRECT_MESSAGE = 'New Direct Message',
  GROUP_MESSAGE = 'New Group Message',
  MISSED_CALL = 'New Missed Call',
}

export enum AlertState {
  READ = 'READ',
  UNREAD = 'UNREAD',
}

export type Alert = {
  at: number
  id?: string
  state?: AlertState
  type: AlertType
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
