import { Item } from '../abstracts/Item.abstract'

export enum FILESYSTEM_TYPE {
  DEFAULT = 'FS_DEFAULT',
}

export type FileSystemExport = {
  type: FILESYSTEM_TYPE
  version: number
  content: Array<Item>
}
