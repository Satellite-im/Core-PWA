import { UploadDropItemType } from '../files/file'

export type ReplyObj = {
  replyId: string
  value: boolean
}

export type ChatTextObj = {
  userId: string
  value: string
}

export interface UploadedFiles extends UploadDropItemType {}
