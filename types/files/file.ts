export type FileType = {
  name: string
  modified: number
  type: string
  size: number
  location: string
  meta: {
    liked: boolean
    shared: boolean
  }
}

export type Folder = {
  name: string
  modified: number
  children: Array<FileType | Folder>
}
