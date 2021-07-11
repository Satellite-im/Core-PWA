import { Commit } from 'vuex'
import { Files } from '~/mock/files'

interface FetchFilesArguments {
  commit: Commit
  state: any
}
export default {
  handler: () => {},
  async fetchFiles({ commit, state }: FetchFilesArguments) {
    if (!state.loading.files) {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      commit('fetchFiles', Files)
      commit('load', 'files')
    }
  },
}
