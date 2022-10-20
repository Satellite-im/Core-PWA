import {
  Notification,
  NotificationType,
  NotificationBase,
  NotificationPayloads,
  MemberJoinNotificationPayload,
  MessageNotificationPayload,
  GroupConversationCreatedNotificationPayload,
  NotificationTypeValues,
} from '~/libraries/Iridium/notifications/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { ConversationMessage } from '~/libraries/Iridium/chat/types'

const NOTIFICATION_BODY_MAX_LENGTH = 80

type NotificationHandler<P = {}> = {
  handler: (notif: P) => void
}

export function listenToNotifications() {
  // @ts-ignore
  const $nuxt = useNuxtApp()

  iridium.notifications.on(
    'notification/create',
    (notification: NotificationBase<keyof NotificationTypeValues>) => {
      const notifHandler = notifHandlers[notification.type].handler
      notifHandler(notification)
    },
  )

  const sendNotification = (
    data: NotificationBase<NotificationPayloads>,
    text: { title: string; description: string },
    onClick: () => void,
  ) => {
    const notification: Notification = {
      at: data.at || Date.now(),
      type: data.type,
      senderId: data.senderId,
      title: text.title,
      description: text.description,
      seen: false,
      payload: data.payload,
      image: data.image || '',
      onNotificationClick: onClick,
    }
    iridium.notifications.sendNotification(notification)
  }

  const notifHandlers: {
    [key in NotificationType]: NotificationHandler<
      NotificationBase<NotificationPayloads[keyof NotificationTypeValues]>
    >
  } = {
    [NotificationType.FRIEND_REQUEST]: {
      handler: (notif: NotificationBase<NotificationPayloads>) => {
        const sender = iridium.users.getUser(notif.senderId)
        const text = {
          title: $nuxt.$t('notifications.new_friend_request.title'),
          description: $nuxt.$t('notifications.new_friend_request.body', {
            sender: sender?.name,
          }),
        }

        const onClick = navigateToFriends

        sendNotification(notif, text, onClick)
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

        const onClick = () => {
          navigateToChat(notif.payload.conversationId)
        }

        sendNotification(notif, text, onClick)
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

        const onClick = () => {
          navigateToChat(notif.payload.conversationId)
        }

        sendNotification(notif, text, onClick)
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

        const onClick = () => {
          navigateToChat(notif.payload.conversationId)
        }

        sendNotification(notif, text, onClick)
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

        const onClick = () => {
          navigateToChat(notif.payload.conversationId)
        }

        sendNotification(notif, text, onClick)
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

        const onClick = () => {
          navigateToChat(notif.payload.conversationId)
        }

        sendNotification(notif, text, onClick)
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

        const onClick = () => {
          navigateToChat(notif.payload.conversationId)
        }

        sendNotification(notif, text, onClick)
      },
    },

    // TODO: Add handling of this event when mentions are implemented
    [NotificationType.MENTION]: {
      handler: (notif: NotificationBase<MessageNotificationPayload>) => {},
    },
  }

  const getMessageDescription = (message: ConversationMessage) => {
    return message.body?.length! > NOTIFICATION_BODY_MAX_LENGTH - 1
      ? `${message.body?.substring(0, NOTIFICATION_BODY_MAX_LENGTH)}...`
      : message.body
  }

  const navigateToFriends = () => {
    const mobileLink = '/mobile/friends?route=requests'
    const desktopLink = '/friends?route=requests'
    $nuxt.$router.push($nuxt.$device.isMobile ? mobileLink : desktopLink)
  }

  const navigateToChat = (conversationId: string) => {
    const mobileLink = `/mobile/chat/${conversationId}`
    const desktopLink = `/chat/${conversationId}`
    $nuxt.$router.push($nuxt.$device.isMobile ? mobileLink : desktopLink)
  }
}
