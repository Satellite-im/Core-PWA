// eslint-disable-next-line import/named
import { Commit, Dispatch } from 'vuex'

interface ActionsArguments {
  commit: Commit
  state: any
  dispatch: Dispatch
}

export default {
  setMessages({ commit }: ActionsArguments, messages: any[]) {
    commit('setMessages', messages)
  },
  sendMessage({ commit }: ActionsArguments, message: any) {
    commit('sendMessage', message)
  },
  setIsScrollOver({ commit }: ActionsArguments, status: boolean) {
    commit('setIsScrollOver', status)
  },
  addReaction({ commit }: ActionsArguments, reaction: any) {
    commit('addReaction', reaction)
  },
}
