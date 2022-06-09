import { TextileState } from './types'

const InitialTextileState = (): TextileState => ({
  initialized: false,
  conversations: {},
  conversationLoading: false,
  messageLoading: false,
  activeConversation: '',
  uploadProgress: {},
  userThread: {
    consentToScan: false,
    blockNsfw: true,
    flipVideo: true,
  },
})

export default InitialTextileState
