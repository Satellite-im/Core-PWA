import { Commit } from 'vuex'
import { Friends } from '~/mock/friends'

interface FetchFriendsArguments {
  commit: Commit
  state: any
}
export default {
  handler: () => {},
  async fetchFriends({ commit, state }: FetchFriendsArguments) {
    if (!state.loading.friends) {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      commit('fetchFriends', Friends)
      commit('load', 'friends')
    }
  },
}
