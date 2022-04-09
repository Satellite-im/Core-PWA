import { ReplyObj, ChatTextObj } from '~/types/chat/chat'
import { UploadDropItemType } from '~/types/files/file'

export interface ChatState {
  replies: ReplyObj[]
  chatTexts: ChatTextObj[]
  files: { [key: string]: UploadDropItemType[] }
  countError: Boolean
  alertNsfw: Boolean
  showFilePreview: Boolean
}
