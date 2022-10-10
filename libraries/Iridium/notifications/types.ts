import { type } from 'os'
import { User } from '~/libraries/Iridium/users/types'

export const NotificationsError = {
  NOTIFICATION_NOT_SENT: 'error.notifications.notifications_not_sent',
}

export enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  DIRECT_MESSAGE = 'direct_message',
  GROUP_MESSAGE = 'group_message',
  MENTION = 'mention',
}

export type Notification = {
  at: number
  type: NotificationType
  senderId: string
  title: string
  description: string
  seen: boolean
  id?: string
  messageId?: string
  conversationId?: string
  image?: string
  onNotificationClick?: () => void
}

export interface NotificationBase
  extends Omit<Notification, 'title' | 'description'> {
  titleValues?: string
  descriptionValues?: string
}

export type NotificationClickEvent = {
  from: string
  topic: string
  payload: { type: NotificationType }
}
