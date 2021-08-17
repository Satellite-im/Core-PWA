import { FileType, Folder } from '~/types/files/file'

interface FilesState {
  tree: Array<FileType | Folder>
}

const InitalFilesState = (): FilesState => ({
  tree: [],
})

export default InitalFilesState
