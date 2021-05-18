import { NuxtState } from '@nuxt/types/app'
import { FileType, Folder } from '~/types/files/file'

const mutations = {
  fetchFiles(state: NuxtState, files: Array<FileType | Folder>) {
    state.files = {
      ...state.files,
      tree: files,
    }
  },
}

export default mutations
