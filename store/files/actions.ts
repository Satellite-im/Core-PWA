import { Files } from '~/mock/files'

export default {
  handler: () => {},
  // @ts-ignore
  async fetchFiles({ commit }) {
    commit('loading', 'files')
    await new Promise((resolve) => setTimeout(resolve, 3000))
    commit('fetchFiles', Files)
    commit('load', 'files')
  },
}
