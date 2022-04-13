import { ChatState } from './types'
import { Friend } from '~/types/ui/friends'

const getters = {
  getFiles: (state: ChatState) => (recipientAddress: string) => {
    return state.files?.[recipientAddress] ?? []
  },
}

export default getters
