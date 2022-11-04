import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import { ConversationMessage } from '~~/libraries/Iridium/chat/types'
import {
  Notification,
  GroupConversationCreatedNotificationPayload,
  MemberJoinNotificationPayload,
  MessageNotificationPayload,
  NotifCreateHandler,
  NotificationBase,
  NotificationPayloads,
  NotificationType,
  NotificationTypeValues,
  FriendRequestNotificationPayload,
} from '~~/libraries/Iridium/notifications/types'
import iridium from '~/libraries/Iridium/IridiumManager'

const NOTIFICATION_BODY_MAX_LENGTH = 80

const useNotifCreateHandlers = () => {
  const $nuxt = useNuxtApp()

  const notifCreateHandlers: {
    [key in NotificationType]: NotifCreateHandler<
      NotificationBase<NotificationPayloads[keyof NotificationTypeValues]>
    >
  } = {
    [NotificationType.FRIEND_REQUEST]: {
      handler: (notif: NotificationBase<FriendRequestNotificationPayload>) => {
        const sender = iridium.users.getUser(notif.senderId)
        const text = {
          title: $nuxt.$t('notifications.new_friend_request.title'),
          description: $nuxt.$t('notifications.new_friend_request.body', {
            sender: sender?.name,
          }),
        }

        sendNotification(notif, text)
      },
    },

    [NotificationType.DIRECT_MESSAGE]: {
      handler: (notif: NotificationBase<MessageNotificationPayload>) => {
        const message = iridium.chat.getConversationMessage(
          notif.payload.conversationId,
          notif.payload.messageId,
        )
        const sender = iridium.users.getUser(notif.senderId)

        const description = getMessageDescription(message)

        const text = {
          title: `${sender?.name}`,
          description: description || '',
        }

        sendNotification(notif, text)
      },
    },

    [NotificationType.GROUP_MESSAGE]: {
      handler: (notif: NotificationBase<MessageNotificationPayload>) => {
        const conversation = iridium.chat.getConversation(
          notif.payload.conversationId,
        )
        const message = iridium.chat.getConversationMessage(
          notif.payload.conversationId,
          notif.payload.messageId,
        )
        const sender = iridium.users.getUser(notif.senderId)

        const description = getMessageDescription(message)

        const text = {
          title: $nuxt.$t('notifications.new_group_message.title', {
            sender: sender?.name || '',
            group: conversation.name || '',
          }),
          description: description || '',
        }

        sendNotification(notif, text)
      },
    },

    [NotificationType.GROUP_CONVERSATION_CREATED]: {
      handler: (
        notif: NotificationBase<GroupConversationCreatedNotificationPayload>,
      ) => {
        const sender = iridium.users.getUser(notif.senderId)
        const conversation = iridium.chat.getConversation(
          notif.payload.conversationId,
        )

        const text = {
          title: $nuxt.$t('notifications.new_group.title', {
            name: sender?.name,
          }),
          description: $nuxt.$t('notifications.new_group.body', {
            sender: sender?.name || '',
            group: conversation.name || '',
          }),
        }

        sendNotification(notif, text)
      },
    },

    [NotificationType.ADDED_TO_GROUP]: {
      handler: (notif: NotificationBase<MessageNotificationPayload>) => {
        const sender = iridium.users.getUser(notif.senderId)
        const conversation = iridium.chat.getConversation(
          notif.payload.conversationId,
        )

        const text = {
          title: $nuxt.$t('notifications.added_to_group.title', {
            group: conversation.name || '',
          }),
          description: $nuxt.$t('notifications.added_to_group.body', {
            sender: sender?.name || '',
            group: conversation.name || '',
          }),
        }

        sendNotification(notif, text)
      },
    },

    [NotificationType.MEMBER_JOIN]: {
      handler: (notif: NotificationBase<MemberJoinNotificationPayload>) => {
        const sender = iridium.users.getUser(notif.senderId)
        const conversation = iridium.chat.getConversation(
          notif.payload.conversationId,
        )
        const newMemberNames = notif.payload.addedMemberIds
          ?.filter((did) => did !== notif.senderId)
          .map((did) => iridium.users.getUser(did)?.name)

        const numNewMembers = newMemberNames.length

        const title = $nuxt.$tc(
          'notifications.member_join.title',
          numNewMembers,
          {
            count: numNewMembers,
            name: sender?.name,
          },
        )
        const description = $nuxt.$tc(
          'notifications.member_join.body',
          numNewMembers - 1,
          {
            addedMember: newMemberNames[0] || '',
            numOtherNewMembers: numNewMembers - 1 || 0,
            group: conversation.name || '',
          },
        )

        const text = {
          title,
          description,
        }

        sendNotification(notif, text)
      },
    },

    [NotificationType.MEMBER_LEAVE]: {
      handler: (notif: NotificationBase<MessageNotificationPayload>) => {
        const sender = iridium.users.getUser(notif.senderId)
        const conversation = iridium.chat.getConversation(
          notif.payload.conversationId,
        )

        const text = {
          title: $nuxt.$t('notifications.member_leave.title'),
          description: $nuxt.$t('notifications.member_leave.body', {
            removedMember: sender?.name || '',
            group: conversation.name || '',
          }),
        }

        sendNotification(notif, text)
      },
    },

    // TODO: Add handling of this event when mentions are implemented
    [NotificationType.MENTION]: {
      handler: (notif: NotificationBase<MessageNotificationPayload>) => {},
    },

    [NotificationType.CALL_INCOMING]: {
      handler: (notif: NotificationBase<MessageNotificationPayload>) => {
        const sender = iridium.users.getUser(notif.senderId)

        const text = {
          title: $nuxt.$t('notifications.call.title'),
          description: $nuxt.$t('notifications.call.body', {
            sender: sender?.name || '',
          }),
        }

        sendNotification(notif, text)
      },
    },
  }

  const getMessageDescription = (message: ConversationMessage) => {
    return message.body?.length! > NOTIFICATION_BODY_MAX_LENGTH - 1
      ? `${message.body?.substring(0, NOTIFICATION_BODY_MAX_LENGTH)}...`
      : message.body
  }

  const sendNotification = (
    data: NotificationBase<NotificationPayloads>,
    text: { title: string; description: string },
  ) => {
    const notification: Notification = {
      at: data.at || Date.now(),
      type: data.type,
      senderId: data.senderId,
      title: text.title,
      description: text.description,
      seen: false,
      payload: data.payload || {},
      image: data.image || '',
    }
    iridium.notifications.sendNotification(notification)
  }

  return {
    notifCreateHandlers,
  }
}

export default useNotifCreateHandlers
