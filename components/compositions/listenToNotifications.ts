import {
  Notification,
  NotificationType,
  NotificationBase,
  NotificationPayloads,
  MemberJoinNotificationPayload,
  MessageNotificationPayload,
} from '~/libraries/Iridium/notifications/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'

const NOTIFICATION_BODY_MAX_LENGTH = 80

export function listenToNotifications() {
  // @ts-ignore
  const $nuxt = useNuxtApp()

  iridium.notifications.on(
    'notification/create',
    (data: NotificationBase<NotificationPayloads>) => {
      const { title, description } = getNotificationText(data)

      const notification: Notification = {
        at: data.at || Date.now(),
        type: data.type,
        senderId: data.senderId,
        title,
        description,
        seen: false,
        image: data.image || '',
        onNotificationClick: () => handleNotificationClick(data),
      }

      iridium.notifications.sendNotification(notification)
    },
  )
  const getMessageAndConversation = (
    conversationId?: string,
    messageId?: string,
  ) => {
    let conversation: Conversation | undefined
    let message: ConversationMessage | undefined
    if (conversationId) {
      conversation = iridium.chat.getConversation(conversationId)
    }
    if (messageId) {
      message = conversation?.message[messageId]
    }
    return { conversation, message }
  }

  const getNotificationText = (
    notification: NotificationBase<NotificationPayloads>,
  ) => {
    const { type, senderId, payload } = notification
    const messageId = (payload as MessageNotificationPayload)?.messageId
    const conversationId = payload?.conversationId
    const sender = iridium.users.getUser(senderId)
    const defaultText = {
      title: $nuxt.$t('notifications.default.title'),
      description: $nuxt.$t('notifications.default.body'),
    }
    const { conversation, message } = getMessageAndConversation(
      conversationId,
      messageId,
    )

    switch (type) {
      case NotificationType.FRIEND_REQUEST:
        return {
          title: $nuxt.$t('notifications.new_friend_request.title'),
          description: $nuxt.$t('notifications.new_friend_request.body', {
            sender: sender?.name,
          }),
        }

      case NotificationType.GROUP_MESSAGE:
      case NotificationType.DIRECT_MESSAGE: {
        if (!conversation) return defaultText
        if (!message) return defaultText

        const isGroup = type === NotificationType.GROUP_MESSAGE
        const groupTitle = $nuxt.$t('notifications.new_group_message.title', {
          sender: sender?.name || '',
          group: conversation.name || '',
        })
        const description =
          message.body?.length! > NOTIFICATION_BODY_MAX_LENGTH - 1
            ? `${message.body?.substring(0, NOTIFICATION_BODY_MAX_LENGTH)}...`
            : message.body

        return {
          title: isGroup ? groupTitle : `${sender?.name}`,
          description: description || '',
        }
      }

      case NotificationType.GROUP_CONVERSATION_CREATED: {
        if (!conversation) return defaultText

        return {
          title: $nuxt.$t('notifications.new_group.title', {
            name: sender?.name,
          }),
          description: $nuxt.$t('notifications.new_group.body', {
            sender: sender?.name || '',
            group: conversation.name || '',
          }),
        }
      }

      case NotificationType.ADDED_TO_GROUP: {
        if (!conversation) return defaultText
        return {
          title: $nuxt.$t('notifications.added_to_group.title', {
            group: conversation.name || '',
          }),
          description: $nuxt.$t('notifications.added_to_group.body', {
            sender: sender?.name || '',
            group: conversation.name || '',
          }),
        }
      }

      case NotificationType.MEMBER_JOIN: {
        if (!conversation) return defaultText
        const memberJoinNotifPayload = payload as MemberJoinNotificationPayload

        const newMemberNames = memberJoinNotifPayload.addedMemberIds
          ?.filter((did) => did !== senderId)
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

        return {
          title,
          description,
        }
      }

      case NotificationType.MEMBER_LEAVE: {
        if (!conversation) return defaultText
        return {
          title: $nuxt.$t('notifications.member_leave.title'),
          description: $nuxt.$t('notifications.member_leave.body', {
            removedMember: sender?.name || '',
            group: conversation.name || '',
          }),
        }
      }

      default:
        return defaultText
    }
  }

  const handleNotificationClick = (
    notification: NotificationBase<NotificationPayloads>,
  ) => {
    switch (notification.type) {
      case NotificationType.FRIEND_REQUEST: {
        const mobileLink = '/mobile/friends?route=requests'
        const desktopLink = '/friends?route=requests'
        $nuxt.$router.push($nuxt.$device.isMobile ? mobileLink : desktopLink)
        break
      }
      case NotificationType.GROUP_MESSAGE:
      case NotificationType.DIRECT_MESSAGE:
      case NotificationType.MEMBER_JOIN:
      case NotificationType.GROUP_CONVERSATION_CREATED:
      case NotificationType.MENTION: {
        const conversationId = notification?.payload?.conversationId || ''
        const mobileLink = `/mobile/chat/${conversationId}`
        const desktopLink = `/chat/${conversationId}`
        $nuxt.$router.push($nuxt.$device.isMobile ? mobileLink : desktopLink)
        break
      }
    }
  }
}
