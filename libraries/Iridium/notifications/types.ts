import { type } from 'os'
import { IridiumPeerIdentifier } from '~/../iridium/dist'
import { User } from '~/libraries/Iridium/users/types'

export const NotificationsError = {
  NOTIFICATION_NOT_SENT: 'error.notifications.notifications_not_sent',
}

export enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  DIRECT_MESSAGE = 'direct_message',
  GROUP_MESSAGE = 'group_message',
  MENTION = 'mention',
  MEMBER_JOIN = 'member_join',
  GROUP_CONVERSATION_CREATED = 'group_conversation_created',
}

export type Notification<P = {}> = {
  at: number
  type: NotificationType
  senderId: IridiumPeerIdentifier
  title: string
  description: string
  seen: boolean
  id?: string
  image?: string
  payload?: P
  onNotificationClick?: () => void
}

export type MessageNotificationPayload = {
  conversationId: string
  messageId: string
  addedMemberIds?: IridiumPeerIdentifier[]
}

export type GroupConversationCreatedNotificationPayload = {
  conversationId: string
}

export type MemberJoinNotificationPayload = {
  addedMemberIds: IridiumPeerIdentifier[]
}

export type NotificationPayloads =
  | (MessageNotificationPayload &
      MemberJoinNotificationPayload &
      GroupConversationCreatedNotificationPayload)
  | undefined

export type NotificationBase<P = {}> = Omit<
  Notification<P>,
  'title' | 'description'
>

export type NotificationClickEvent = {
  from: string
  topic: string
  payload: { type: NotificationType }
}
