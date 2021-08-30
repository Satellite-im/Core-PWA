import { Commit } from 'vuex'

interface FetchCallsArguments {
  commit: Commit
  state: any
}

export default {
  handler: () => {},
  setSelectedGroup({ commit }: FetchCallsArguments, address: String) {
    commit('setSelectedGroup', address)
  },
}
