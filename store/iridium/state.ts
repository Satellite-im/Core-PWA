import { IridiumState } from '~/store/iridium/types'

const InitialIridiumState: IridiumState = {
  initialized: false,
  conversations: {},
  activeConversation: '',
  conversationLoading: false,
  messageLoading: false,
}

export default () => InitialIridiumState
