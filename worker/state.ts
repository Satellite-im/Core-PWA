import { Conversation } from '~/store/textile/types'
import { Group } from '~/types/ui/core'
import { Friend } from '~/types/ui/friends'

type TextileWorkerState = {
  initialized: boolean
  messageLoading: boolean
  conversationLoading: boolean
}

type WorkerState = {
  friends: Friend[]
  groups: Group[]
  conversations: Conversation
  textile: TextileWorkerState
}

const state: WorkerState = {
  friends: [],
  groups: [],
  conversations: {},
  textile: {
    initialized: false,
    messageLoading: false,
    conversationLoading: false,
  },
}
export default state
