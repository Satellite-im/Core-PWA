import { ReplyObj, ChatTextObj, ReplyImageObj } from '~/types/chat/chat'

export interface ChatState {
  replies: ReplyObj[]
  chatTexts: ChatTextObj[]
  replyImage: ReplyImageObj[]
}
