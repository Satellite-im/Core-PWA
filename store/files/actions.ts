import { DataStateType } from '../dataState/types'
import { ActionsArguments } from '../store.types'
import { Files } from '~/mock/files'

export default {
  handler: () => {},
  /**
   * @method
   * @description
   * @param
   * @returns
   * @example
   */
  async fetchFiles({ commit, state }: ActionsArguments) {
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
