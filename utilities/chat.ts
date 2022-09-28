import { ConversationMessage } from '~/libraries/Iridium/chat/types'

export function conversationMessageIsNotice(message: ConversationMessage) {
  switch (message.type) {
    case 'member_join':
    case 'member_leave':
      return true
    default:
      return false
  }
}
