import { ICurrentChat } from '~/types/chat/chat'

export interface ChatReply {
  replyId: string
  value: boolean
}

export interface ChatText {
  userId: string
  value: string
}

export interface ChatFileUpload {
  file: File
  nsfw: boolean
  progress: number
  thumbnail?: File // scaled down
}

export interface ChatState {
  replies: ChatReply[]
  chatTexts: ChatText[]
  files: { [key: string]: ChatFileUpload[] }
  countError: boolean
  currentChat: ICurrentChat
}
