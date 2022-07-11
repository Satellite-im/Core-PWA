import { FileSortEnum } from '~/libraries/Enums/enums'
import { IridiumDirectory } from '~/libraries/Iridium/files/types'

export interface FileSort {
  category: FileSortEnum
  asc: boolean
}

export interface FilesState {
  gridLayout: boolean // false for table
  sort: FileSort
  status: string
  path: { id: IridiumDirectory['id']; name: string }[]
}
