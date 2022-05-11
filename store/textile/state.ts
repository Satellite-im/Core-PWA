import { TextileState } from './types'

const InitialTextileState = (): TextileState => ({
  initialized: false,
  conversations: {},
  conversationLoading: false,
  messageLoading: false,
  activeConversation: '',
  uploadProgress: {},
  threadData: {
    consentToScan: false,
    blockNsfw: true,
  },
})

export default InitialTextileState
