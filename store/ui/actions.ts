/* eslint-disable import/named */
import { Commit } from 'vuex'

interface UIArguments {
  commit: Commit
  state: any
}

export default {
  handler: () => {},
  addReaction({ commit }: UIArguments, reaction: any) {
    commit('addReaction', reaction)
  },
}
