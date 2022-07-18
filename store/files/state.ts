import { FileSortEnum } from '~/libraries/Enums/enums'
import { FilesState } from '~/store/files/types'

const InitialFilesState: FilesState = {
  currentUpload: undefined,
  downloadList: [],
  gridLayout: true,
  path: [],
  preview: undefined,
  rename: undefined,
  sort: {
    category: FileSortEnum.MODIFIED,
    asc: true,
  },
  status: '',
}

export default () => InitialFilesState
