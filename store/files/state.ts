import { FileSortEnum } from '~/libraries/Enums/enums'
import { FilesState } from '~/store/files/types'

const InitialFriendsState: FilesState = {
  gridLayout: true,
  path: [],
  sort: {
    category: FileSortEnum.MODIFIED,
    asc: true,
  },
  status: '',
}

export default () => InitialFriendsState
