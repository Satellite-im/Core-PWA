import { ChatState } from './types'
import { ReplyObj, ChatTextObj, ReplyImageObj } from '~/types/chat/chat'

const mutations = {
  setChatText(state: ChatState, req: ChatTextObj) {
    state.chatTexts.some((item) => item.userId === req.userId)
      ? state.chatTexts.map((item) => {
          if (item.userId === req.userId) {
            item.value = req.value
          }
        })
      : state.chatTexts.push(req)
  },
  setChatReply(state: ChatState, req: ReplyObj) {
    state.replies.some((item) => item.replyId === req.replyId)
      ? state.replies.map((item) => {
          if (item.replyId === req.replyId) {
            item.value = req.value
          }
        })
      : state.replies.push(req)
  },
  setImageReply(state: ChatState, req: ReplyImageObj) {
    console.log('in mutations')
    // console.log(state)
    // console.log(req)
    state.replyImage.some((item) => item.replyId === req.replyId)
      ? state.replyImage.map((item) => {
          if (item.replyId === req.replyId) {
            console.log('in if statement')

            item.replyImage = req.replyImage
          }
        })
      : state.replyImage.push(req)
  },
}

export default mutations
