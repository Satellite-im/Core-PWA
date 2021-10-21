import { FilesState } from './types'
import { FileType, Folder } from '~/types/files/file'

const mutations = {
  fetchFiles(state: FilesState, files: Array<FileType | Folder>) {
    state.tree = files
  },
}

export default mutations
