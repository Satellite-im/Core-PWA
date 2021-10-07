import { Files } from '~/mock/files'
import { DataStateType } from '../dataState/types'
import { ActionsArguments } from '../store.types'

export default {
  handler: () => {},
  /**
   * @method fetchFiles DocsTODO
   * @description
   * @param
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
