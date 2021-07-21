import { Commit } from 'vuex'

interface FetchCallsArguments {
  commit: Commit
  state: any
}

export default {
  handler: () => {},
  async acceptCall({ commit, state }: FetchCallsArguments) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    commit('toggleIncomingCall', false)
  },
  async denyCall({ commit, state }: FetchCallsArguments) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    commit('toggleIncomingCall', false)
  },
}
