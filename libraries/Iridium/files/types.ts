/* eslint-disable no-use-before-define */
import { DIRECTORY_TYPE } from '~/libraries/Files/types/directory'
import { FILE_TYPE } from '~/libraries/Files/types/file'

export type FileUpdate = 'upload' | 'delete' | 'like' | 'share'

interface Shared {
  id: string
  name: string
  liked: boolean
  shared: boolean
  modified: number
  size: number
  parentId: IridiumDirectory['id'] // empty string if root item
}

export interface IridiumFile extends Shared {
  type: FILE_TYPE
  description?: string
  thumbnail: string
  extension: string
  nsfw: boolean
}

export interface IridiumDirectory extends Shared {
  type: DIRECTORY_TYPE
  children: IridiumItem[]
}

export type IridiumItem = IridiumFile | IridiumDirectory
