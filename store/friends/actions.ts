import { Friends } from '~/mock/friends'

export default {
  handler: () => {},
  // @ts-ignore
  async fetchFriends({ commit }) {
    commit('loading', 'friends')
    await new Promise((resolve) => setTimeout(resolve, 3000))
    commit('fetchFriends', Friends)
    commit('load', 'friends')
  },
}
