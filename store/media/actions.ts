// eslint-disable-next-line import/named
import { Commit } from 'vuex'

interface FetchCallsArguments {
  commit: Commit
  state: any
}

export default {
  handler: () => {},
  acceptCall({ commit }: FetchCallsArguments) {
    commit('toggleIncomingCall', '')
  },
  denyCall({ commit }: FetchCallsArguments) {
    commit('toggleIncomingCall', '')
  },
}
