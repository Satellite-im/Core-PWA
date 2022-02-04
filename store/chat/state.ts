import { ChatState } from './types'

const InitialChatState = (): ChatState => ({
  replies: [],
  chatTexts: [],
  uploadedFiles: {},
})

export default InitialChatState
