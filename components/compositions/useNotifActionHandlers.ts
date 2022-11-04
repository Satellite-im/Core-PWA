import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import {
  ActionTypeIds,
  FriendRequestNotificationPayload,
  MessageNotificationPayload,
  NotifActionHandler,
  NotifActionTypes,
  NotificationPayloads,
  NotificationTypeValues,
} from '~~/libraries/Iridium/notifications/types'
import iridium from '~/libraries/Iridium/IridiumManager'

const useNotifActionHandlers = () => {
  const $nuxt = useNuxtApp()

  const notifActionHandlers: {
    [key in ActionTypeIds]: NotifActionHandler<
      NotificationPayloads[keyof NotificationTypeValues]
    >
  } = {
    [ActionTypeIds.CALL_INCOMING]: {
      [NotifActionTypes.TAP]: (payload: MessageNotificationPayload) => {
        navigateToChat(payload.conversationId)
      },
    },

    [ActionTypeIds.FRIEND_REQUEST]: {
      [NotifActionTypes.TAP]: (_payload: FriendRequestNotificationPayload) => {
        navigateToFriends()
      },
      [NotifActionTypes.ACCEPT]: (
        payload: FriendRequestNotificationPayload,
      ) => {
        iridium.friends.requestAccept(payload.senderId)
      },
      [NotifActionTypes.DECLINE]: (
        payload: FriendRequestNotificationPayload,
      ) => {
        iridium.friends.requestReject(payload.senderId)
      },
    },

    [ActionTypeIds.DEFAULT]: {
      [NotifActionTypes.TAP]: (_payload: NotificationPayloads) => {},
    },

    [ActionTypeIds.MESSAGE]: {
      [NotifActionTypes.TAP]: (payload: MessageNotificationPayload) => {
        navigateToChat(payload.conversationId)
      },
      [NotifActionTypes.RESPOND]: (
        payload: MessageNotificationPayload,
        inputValue,
      ) => {
        sendMessage(payload.conversationId, inputValue)
        navigateToChat(payload.conversationId)
      },
    },
  }

  const navigateToFriends = () => {
    const mobileLink = '/mobile/friends?route=request'
    const desktopLink = '/friends?route=requests'
    $nuxt.$router.push($nuxt.$device.isMobile ? mobileLink : desktopLink)
  }

  const navigateToChat = (conversationId: string) => {
    const mobileLink = `/mobile/chat/${conversationId}`
    const desktopLink = `/chat/${conversationId}`
    $nuxt.$router.push($nuxt.$device.isMobile ? mobileLink : desktopLink)
  }

  function sendMessage(conversationId: string, message?: string) {
    if (!conversationId || !message) {
      return
    }
    iridium.chat.sendMessage({
      at: Date.now(),
      type: 'text',
      body: message,
      conversationId,
      attachments: [],
      payload: {},
    })
  }

  return {
    notifActionHandlers,
  }
}

export default useNotifActionHandlers
