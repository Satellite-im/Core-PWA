import { FileRouteEnum, FileSortEnum } from '~/libraries/Enums/enums'
import {
  IridiumDirectory,
  IridiumFile,
  IridiumItem,
} from '~/libraries/Iridium/files/types'

export interface FileSort {
  category: FileSortEnum
  asc: boolean
}

export interface FilesState {
  currentUpload?: {
    name: string
    size: number
  }
  downloadList: string[]
  gridLayout: boolean // false for table
  path: { id: IridiumDirectory['id']; name: IridiumDirectory['name'] }[]
  preview?: IridiumFile
  rename?: IridiumItem
  route: FileRouteEnum
  sort: FileSort
  status: string
}
