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
  thumbnail?: string // base64, scaled down
}

export interface ChatState {
  replies: ChatReply[]
  chatTexts: ChatText[]
  files: { [key: string]: ChatFileUpload[] }
  countError: boolean
  currentChat: ICurrentChat
  uploadProgress: {
    [key: string]: {
      // key is uuid, cant use name in case two uploaded files have the same name
      name: string
      progress: number // as a percentage
    }
  }
}
