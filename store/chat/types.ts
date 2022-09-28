import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'

export interface ChatFileUpload {
  file: File
  nsfw: boolean
  progress: number
  thumbnail?: string // scaled down base64
}

export interface ChatState {
  files: { [key: Conversation['id']]: ChatFileUpload[] | undefined }
  activeUploadChats: Conversation['id'][]
  draftMessages: { [key: Conversation['id']]: string }
  replyChatbarMessages: { [key: Conversation['id']]: ConversationMessage }
}
