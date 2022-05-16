import { ChatState } from './types'

const InitialChatState = (): ChatState => ({
  replies: [],
  chatTexts: [],
  files: {},
  countError: false,
  alertNsfw: false,
  containsNsfw: false,
})

export default InitialChatState
