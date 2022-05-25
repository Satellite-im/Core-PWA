import { ChatState } from './types'
import { ScrollDirections } from '~/types/chat/chat'

export const initialCurrentChat = {
  messages: [],
  page: 1,
  size: 10,
  hasNextPage: true,
  direction: ScrollDirections.TOP,
  isMessagesLoading: false,
  lastLoadedMessageId: '',
  isScrollOver: true,
  offset: 0,
  showOlderMessagesInfo: false,
}

const InitialChatState = (): ChatState => ({
  replies: [],
  chatTexts: [],
  files: {},
  countError: false,
  alertNsfw: false,
  containsNsfw: false,
  currentChat: initialCurrentChat,
})

export default InitialChatState
