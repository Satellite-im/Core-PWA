import { TextileState } from './types'

const getters = {
  getInitialized: (state: TextileState): boolean => {
    return state.initialized
  },
  getConversation: (state: TextileState) => (address: string) => {
    return state.conversations[address] || null
  },
  getConversationMessages: (state: TextileState) => (address: string) => {
    return state.conversations[address]
      ? Object.values(state.conversations[address].messages)
      : []
  },
}

export default getters
