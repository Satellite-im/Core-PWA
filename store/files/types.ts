import { FileSortEnum } from '~/libraries/Enums/enums'
import {
  IridiumDirectory,
  IridiumFile,
  IridiumItem,
} from '~/libraries/Iridium/files/types'

export interface FileSort {
  category: FileSortEnum
  asc: boolean
}

interface CurrentUploadState {
  name: string
  size: number
}

interface SearchState {
  value: string
  searchAll: boolean
}

export interface FilesState {
  currentUpload?: CurrentUploadState
  downloadList: string[]
  gridLayout: boolean // false for table
  path: { id: IridiumDirectory['id']; name: IridiumDirectory['name'] }[]
  preview?: IridiumFile
  rename?: IridiumItem
  search: SearchState
  sort: FileSort
  status: string
}
