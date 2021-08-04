import { NuxtState } from '@nuxt/types/app'
import { FileType, Folder } from '~/types/files/file'

const mutations = {
  search(state: NuxtState, results: Array<FileType | Folder>) {
    state.search = {
      ...state.search,
      results,
    }
  },
}

export default mutations
