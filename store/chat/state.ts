import { ChatState } from './types'

const InitialChatState = (): ChatState => ({
  replies: [],
  chatTexts: []
})

export default InitialChatState
