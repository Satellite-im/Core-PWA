import { FileType, Folder } from '~/types/files/file'

export interface FilesState {
  tree: Array<FileType | Folder>
}

export const FilesError = {
  INVALID_FILE: 'errors.sign_in.invalid_file',
}
