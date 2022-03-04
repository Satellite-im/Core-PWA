import { TextileState } from './types'

const InitialTextileState = (): TextileState => ({
  initialized: false,
  conversations: {},
  conversationLoading: false,
  messageLoading: false,
  uploadProgress: {},
  filesLoading: false,
})

export default InitialTextileState
