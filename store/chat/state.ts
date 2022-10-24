import { ChatState } from './types'

const InitialChatState = (): ChatState => ({
  files: {},
  activeUploadChats: [],
  draftMessages: {},
  replyChatbarMessages: {},
  enhancersRoute: '',
})

export default InitialChatState
