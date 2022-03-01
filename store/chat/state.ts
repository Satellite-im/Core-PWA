import { ChatState } from './types'

const InitialChatState = (): ChatState => ({
  replies: [],
  chatTexts: [],
  files: {},
})

export default InitialChatState
