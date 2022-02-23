import { DataStateType } from '../dataState/types'
import { FilesState } from './types'
import { ActionsArguments } from '~/types/store/store'
import { Files } from '~/mock/files'

export default {
  handler: () => {},
  /**
   * @method fetchFiles DocsTODO
   * @description
   * @param
   * @example
   */
  async fetchFiles({ commit, rootState }: ActionsArguments<FilesState>) {
    const { files } = rootState.dataState
    if (files === DataStateType.Loading || files === DataStateType.Updating) {
      return
    }
    if (files === DataStateType.Empty) {
      commit(
        'dataState/setDataState',
        { key: 'files', value: DataStateType.Loading },
        { root: true },
      )
    } else {
      commit(
        'dataState/setDataState',
        { key: 'files', value: DataStateType.Updating },
        { root: true },
      )
    }
    commit('fetchFiles', Files)
    commit(
      'dataState/setDataState',
      { key: 'files', value: DataStateType.Ready },
      { root: true },
    )
  },
}
