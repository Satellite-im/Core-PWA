import { Commit } from 'vuex'

interface FetchCallsArguments {
  commit: Commit
  state: any
}

export default {
  handler: () => {},
  async acceptCall({ commit }: FetchCallsArguments) {
    commit('toggleIncomingCall', '')
  },
  async denyCall({ commit }: FetchCallsArguments) {
    commit('toggleIncomingCall', '')
  },
  setMessages({ commit }: FetchCallsArguments, messages: any[]) {
    commit('setMessages', messages)
  },
  sendMessage({ commit }: FetchCallsArguments, message: any) {
    commit('sendMessage', message)
  },
  setIsScrollOver({ commit }: FetchCallsArguments, status: boolean) {
    commit('setIsScrollOver', status)
  },
}
