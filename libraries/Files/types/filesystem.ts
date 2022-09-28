import { ExportItem } from '~/libraries/Iridium/files/types'

export enum FILESYSTEM_TYPE {
  DEFAULT = 'FS_DEFAULT',
}

export type PersonalBucketIndex = {
  type: FILESYSTEM_TYPE
  version: number
  content: Array<ExportItem>
}

export interface SharedBucketIndexItem {
  id: string
  name: string
  url: string
  size: number
  nsfw: boolean
}

export type SharedBucketIndex = {
  version: number
  content: SharedBucketIndexItem[]
}
