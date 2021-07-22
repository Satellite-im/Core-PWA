import { Commit } from 'vuex'

interface FetchCallsArguments {
  commit: Commit
  state: any
}

export default {
  handler: () => {},
  async acceptCall({ commit, state }: FetchCallsArguments) {
    commit('toggleIncomingCall', false)
  },
  async denyCall({ commit, state }: FetchCallsArguments) {
    commit('toggleIncomingCall', false)
  },
}
