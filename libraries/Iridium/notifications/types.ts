import { IridiumPeerIdentifier } from '~/../iridium/dist'

export const NotificationsError = {
  NOTIFICATION_NOT_SENT: 'error.notifications.notifications_not_sent',
}

export enum NotificationType {
  FRIEND_REQUEST = 'friend_request',
  DIRECT_MESSAGE = 'direct_message',
  GROUP_MESSAGE = 'group_message',
  MENTION = 'mention',
  MEMBER_JOIN = 'member_join',
  MEMBER_LEAVE = 'member_leave',
  ADDED_TO_GROUP = 'added_to_group',
  GROUP_CONVERSATION_CREATED = 'group_conversation_created',
  CALL_INCOMING = 'call_incoming',
}

export type NotificationTypeValues = NotificationType[keyof NotificationType]

export type Notification<P = {}> = {
  at: number
  type: NotificationType
  senderId: IridiumPeerIdentifier
  title: string
  description: string
  seen: boolean
  payload: P
  id?: string
  image?: string
}

export type FriendRequestNotificationPayload = {
  senderId: IridiumPeerIdentifier
}

export type MessageNotificationPayload = {
  conversationId: string
  messageId: string
}

export type GroupConversationCreatedNotificationPayload = {
  conversationId: string
}

export type MemberJoinNotificationPayload = MessageNotificationPayload & {
  addedMemberIds: IridiumPeerIdentifier[]
}

export enum ActionTypeIds {
  CALL_INCOMING = 'call_incoming',
  DEFAULT = 'default',
  FRIEND_REQUEST = 'friend_request',
  MESSAGE = 'message',
}

export type NotificationPayloads =
  | FriendRequestNotificationPayload
  | GroupConversationCreatedNotificationPayload
  | MemberJoinNotificationPayload
  | MessageNotificationPayload

export type NotificationBase<P = {}> = Omit<
  Notification<P>,
  'title' | 'description'
>

export type NotifCreateHandler<P = {}> = {
  handler: (notif: P) => void
}

export enum NotifActionTypes {
  TAP = 'tap',
  RESPOND = 'respond',
  ACCEPT = 'accept',
  DECLINE = 'decline',
}

export type NotifActionHandler<P = {}> = {
  [key in NotifActionTypes]?: (payload: P, inputValue?: string) => void
}
