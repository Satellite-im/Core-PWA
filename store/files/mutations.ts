import { FileSort, FilesState } from '~/store/files/types'

const mutations = {
  setSort(state: FilesState, sort: FileSort) {
    state.sort = sort
  },
  setStatus(state: FilesState, status: string) {
    state.status = status
  },
  toggleLayout(state: FilesState) {
    state.gridLayout = !state.gridLayout
  },
  setPath(state: FilesState, path: { id: string; name: string }[]) {
    state.path = path
  },
}

export default mutations
