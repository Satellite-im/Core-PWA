export type FileType = {
  name: string
  modified: number
  type: string
  size: number
  location: string
}

export type Folder = {
  name: string
  modified: number
  children: Array<FileType | Folder>
}
