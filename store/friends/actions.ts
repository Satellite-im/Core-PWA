import { Commit } from 'vuex'
import { DataStateType } from '../dataState/state'
import { Friends } from '~/mock/friends'

interface FetchFriendsArguments {
  commit: Commit
  state: any
}
export default {
  handler: () => {},
  async fetchFriends({ commit, state }: FetchFriendsArguments) {
    if (
      state.dataState.friends === DataStateType.Loading ||
      state.dataState.friends === DataStateType.Updating
    ) {
      return
    }
    if (state.dataState.friends === DataStateType.Empty) {
      commit('setDataState', { key: 'friends', value: DataStateType.Loading })
    } else {
      commit('setDataState', { key: 'friends', value: DataStateType.Updating })
    }
    await new Promise((resolve) => setTimeout(resolve, 3000))
    commit('fetchFriends', Friends)
    commit('setDataState', { key: 'friends', value: DataStateType.Ready })
  },
}
