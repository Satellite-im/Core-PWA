import { ChatState } from './types'

const InitialChatState = (): ChatState => ({
  files: {},
  activeUploadChats: [],
  draftMessages: {},
  replyChatbarMessages: {},
})

export default InitialChatState
