import { ChatState } from './types'

const getters = {
  getFiles: (state: ChatState) => (recipientAddress: string) => {
    return state.files?.[recipientAddress] ?? []
  },
}

export default getters
