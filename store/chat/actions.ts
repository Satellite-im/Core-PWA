import { ChatState } from './types'
import { ActionsArguments } from '~/types/store/store'
import { ChatTextObj } from '~/types/chat/chat'

export default {
  setChatText({ commit }: ActionsArguments<ChatState>, req: ChatTextObj) {
    commit('chatText', req)
  },
}
