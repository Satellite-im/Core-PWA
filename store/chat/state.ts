import { ChatState } from './types'

export const initialCurrentChat = {
  messages: [],
  page: 1,
  size: 10,
  hasNextPage: true,
  direction: 'top' as 'top',
  isMessagesLoading: false,
  lastLoadedMessageId: '',
  isScrollOver: true,
  offset: 0,
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
