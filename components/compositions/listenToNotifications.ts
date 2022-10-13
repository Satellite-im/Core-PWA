import {
  Notification,
  NotificationType,
  NotificationBase,
} from '~/libraries/Iridium/notifications/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export function listenToNotifications() {
  // @ts-ignore
  const $nuxt = useNuxtApp()

  iridium.notifications.on('notification/create', (data: NotificationBase) => {
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
  })

  const getNotificationText = (notification: NotificationBase) => {
    const { type, senderId, conversationId } = notification
    const sender = iridium.users.getUser(senderId)
    const defaultText = {
      title: 'Notification',
      description: 'You have a new notification',
    }

    switch (type) {
      case NotificationType.FRIEND_REQUEST:
        return {
          title: 'New Friend Request',
          description: `${sender?.name} sent you a friend request`,
        }

      case NotificationType.GROUP_MESSAGE:
      case NotificationType.DIRECT_MESSAGE: {
        if (!conversationId) return defaultText
        const conversation = iridium.chat.getConversation(conversationId)
        if (!conversation) return defaultText
        if (!notification.messageId) return defaultText
        const message = conversation.message[notification.messageId]

        const isGroup = type === NotificationType.GROUP_MESSAGE
        const groupTitle = $nuxt.$t('notifications.new_message.group_title', {
          name: conversation.name,
          server: conversation.name,
        })

        return {
          title: isGroup ? groupTitle : `${sender?.name}`,
          description: message.body || 'You have a new message',
        }
      }

      default:
        return defaultText
    }
  }

  const handleNotificationClick = (notification: NotificationBase) => {
    switch (notification.type) {
      case NotificationType.FRIEND_REQUEST: {
        const mobileLink = '/mobile/friends?route=requests'
        const desktopLink = '/friends?route=requests'
        $nuxt.$router.push($nuxt.$device.isMobile ? mobileLink : desktopLink)
        break
      }
      case NotificationType.GROUP_MESSAGE:
      case NotificationType.DIRECT_MESSAGE:
      case NotificationType.MENTION: {
        const conversationId = notification.conversationId
        const mobileLink = `/mobile/chat/${conversationId}`
        const desktopLink = `/chat/${conversationId}`
        $nuxt.$router.push($nuxt.$device.isMobile ? mobileLink : desktopLink)
        break
      }
    }
  }
}
