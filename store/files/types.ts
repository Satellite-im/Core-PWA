import { FileType, Folder } from '~/types/files/file'

export interface FilesState {
  tree: Array<FileType | Folder>
}
