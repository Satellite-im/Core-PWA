import { FileType, DirectoryType } from '~/libraries/Enums/enums'

interface ExportSharedProps {
  id: string
  name: string
  liked: boolean
  shared: boolean
  type: FileType | DirectoryType
  modified: number
}

export interface ExportFile extends ExportSharedProps {
  size: number
  description: string
  thumbnail: string
  extension: string
  nsfw: boolean
}

export interface ExportDirectory extends ExportSharedProps {
  // eslint-disable-next-line no-use-before-define
  children: ExportItem[]
}

export type ExportItem = ExportFile | ExportDirectory

export type FileUpdate = 'upload' | 'delete' | 'like' | 'share'
