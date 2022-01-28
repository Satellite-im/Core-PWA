import { ChatState } from './types'

const InitialChatState = (): ChatState => ({
  replies: [],
  chatTexts: [],
  replyImage: [],
})

export default InitialChatState
