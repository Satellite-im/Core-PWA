import { Commit } from 'vuex'
import { DataStateType } from '../dataState/state'
import { searchResult } from '~/mock/search'

interface SearchArgument {
  commit: Commit
  state: any
}
export default {
  handler: () => {},
  async search({ commit, state }: SearchArgument) {
    if (
      state.dataState.files === DataStateType.Loading ||
      state.dataState.files === DataStateType.Updating
    ) {
      return
    }
    if (state.dataState.files === DataStateType.Empty) {
      commit('setDataState', { key: 'search', value: DataStateType.Loading })
    } else {
      commit('setDataState', { key: 'search', value: DataStateType.Updating })
    }
    await new Promise((resolve) => setTimeout(resolve, 3000))
    commit('search', searchResult)
    commit('setDataState', { key: 'search', value: DataStateType.Ready })
  },
}
