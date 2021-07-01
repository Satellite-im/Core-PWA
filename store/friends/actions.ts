import { Friends } from '~/mock/friends'

export default {
  handler: () => {},
  // @ts-ignore
  async fetchFriends({ commit }) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    commit('fetchFriends', Friends)
    commit('load', 'friends')
  },
}
