import { ReplyObj, ChatTextObj } from '~/types/chat/chat'

export interface ChatState {
  replies: ReplyObj[]
  chatTexts: ChatTextObj[]
}
