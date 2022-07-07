import { DIRECTORY_TYPE } from '~/libraries/Files/types/directory'
import { FILE_TYPE } from '~/libraries/Files/types/file'

export type FileUpdate = 'upload' | 'delete' | 'like' | 'share'

interface ExportSharedProps {
  id: string
  name: string
  liked: boolean
  shared: boolean
  type: FILE_TYPE | DIRECTORY_TYPE
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
