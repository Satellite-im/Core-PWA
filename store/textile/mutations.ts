import { TextileState } from './types'
import { Message } from '~/types/textile/mailbox'

const mutations = {
  textileInitialized(state: TextileState, status: boolean) {
    state.initialized = status
  },
  setConversation(
    state: TextileState,
    { address, messages }: { address: string; messages: Message[] }
  ) {
    state.conversations[address] = messages
  },
  resetConversation(state: TextileState, { address }: { address: string }) {
    state.conversations[address] = []
  },
  addMessageToConversation(
    state: TextileState,
    { address, message }: { address: string; message: Message }
  ) {
    state.conversations[address].push(message)
  },
  setConversationLoading(
    state: TextileState,
    { loading }: { loading: boolean }
  ) {
    state.conversationLoading = loading
  },
}

export default mutations
