import { DIRECTORY_TYPE } from './directory'
import { FILE_TYPE } from './file'

export enum FILESYSTEM_TYPE {
  DEFAULT = 'FS_DEFAULT',
}
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
}

export interface ExportDirectory extends ExportSharedProps {
  // eslint-disable-next-line no-use-before-define
  children: ExportItem[]
}

export type ExportItem = ExportFile | ExportDirectory

export type FileSystemExport = {
  type: FILESYSTEM_TYPE
  version: number
  content: Array<ExportItem>
}
