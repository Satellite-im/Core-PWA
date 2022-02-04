import { ReplyObj, ChatTextObj, UploadedFiles } from '~/types/chat/chat'

export interface ChatState {
  replies: ReplyObj[]
  chatTexts: ChatTextObj[]
  uploadedFiles: { [key: string]: UploadedFiles[] }
}
