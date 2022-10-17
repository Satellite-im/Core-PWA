import {
  Notification,
  NotificationType,
  NotificationBase,
  NotificationPayloads,
} from '~/libraries/Iridium/notifications/types'
import iridium from '~/libraries/Iridium/IridiumManager'

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

  const getNotificationText = (
    notification: NotificationBase<NotificationPayloads>,
  ) => {
    const { type, senderId, payload } = notification
    const messageId = payload?.messageId
    const conversationId = payload?.conversationId
    const sender = iridium.users.getUser(senderId)
    const defaultText = {
      title: $nuxt.$t('notifications.new_notification'),
      description: $nuxt.$t('notifications.new_notification_description'),
    }

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
        if (!conversationId) return defaultText
        const conversation = iridium.chat.getConversation(conversationId)
        if (!conversation) return defaultText
        if (!messageId) return defaultText
        const message = conversation.message[messageId]

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
        if (!conversationId) return defaultText
        const conversation = iridium.chat.getConversation(conversationId)
        if (!conversation) return defaultText

        const title = $nuxt.$t('notifications.new_group.title', {
          name: sender?.name,
        })
        const description = $nuxt.$t('notifications.new_group.body', {
          sender: sender?.name || '',
          group: conversation.name || '',
        })

        return {
          title,
          description,
        }
      }

      case NotificationType.MEMBER_JOIN: {
        if (!conversationId) return defaultText
        const conversation = iridium.chat.getConversation(conversationId)
        if (!conversation) return defaultText

        const newMemberNames = payload.addedMemberIds
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
