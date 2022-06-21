import { TextileState } from './types'

const InitialTextileState = (): TextileState => ({
  initialized: false,
  conversations: {},
  conversationLoading: false,
  messageLoading: false,
  activeConversation: '',
  userThread: {
    consentToScan: false,
    blockNsfw: true,
    flipVideo: true,
    filesVersion: 1,
  },
  fileSystem: {
    totalSize: 0,
    percentageUsed: 0,
  },
})

export default InitialTextileState
