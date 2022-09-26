import { ChatState } from './types'

const InitialChatState = (): ChatState => ({
  files: {},
  activeUploadChats: [],
  countError: false,
  draftMessages: {},
  replyChatbarMessages: {},
})

export default InitialChatState
