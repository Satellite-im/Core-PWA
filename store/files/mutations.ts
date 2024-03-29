import { FileSortEnum } from '~/libraries/Enums/enums'
import { IridiumFile, IridiumItem } from '~/libraries/Iridium/files/types'
import { FilesState } from '~/store/files/types'

const mutations = {
  addDownload(state: FilesState, name: string) {
    state.downloadList.push(name)
  },
  removeDownload(state: FilesState, name: string) {
    const index = state.downloadList.indexOf(name)
    if (index > -1) {
      state.downloadList.splice(index, 1)
    }
  },
  setCurrentUpload(state: FilesState, item?: FilesState['currentUpload']) {
    state.currentUpload = item
  },
  setRename(state: FilesState, item?: IridiumItem) {
    state.rename = item
  },
  setSearchValue(state: FilesState, searchValue: string) {
    state.search.value = searchValue
  },
  setPath(state: FilesState, path: { id: string; name: string }[]) {
    state.path = path
  },
  setPreview(state: FilesState, file?: IridiumFile) {
    state.preview = file
  },
  // if current category, swap asc/desc. if different, change category
  setSort(state: FilesState, category: FileSortEnum) {
    state.sort =
      state.sort.category === category
        ? { category: state.sort.category, asc: !state.sort.asc }
        : { category, asc: true }
  },
  setStatus(state: FilesState, status: string) {
    state.status = status
  },
  toggleLayout(state: FilesState) {
    state.gridLayout = !state.gridLayout
  },
  toggleSearchAll(state: FilesState) {
    state.search.searchAll = !state.search.searchAll
  },
}

export default mutations
