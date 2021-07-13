import { Commit } from 'vuex'
import { DataStateType } from '../dataState/state'
import { Files } from '~/mock/files'

interface FetchFilesArguments {
  commit: Commit
  state: any
}
export default {
  handler: () => {},
  async fetchFiles({ commit, state }: FetchFilesArguments) {
    if (
      state.dataState.files === DataStateType.Loading ||
      state.dataState.files === DataStateType.Updating
    ) {
      return
    }
    if (state.dataState.files === DataStateType.Empty) {
      commit('setDataState', { key: 'files', value: DataStateType.Loading })
    } else {
      commit('setDataState', { key: 'files', value: DataStateType.Updating })
    }
    await new Promise((resolve) => setTimeout(resolve, 3000))
    commit('fetchFiles', Files)
    commit('setDataState', { key: 'files', value: DataStateType.Ready })
  },
}
