import { Files } from '~/mock/files'

export default {
  handler: () => {},
  // @ts-ignore
  async fetchFiles({ commit }) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    commit('fetchFiles', Files)
    commit('load', 'files')
  },
}
