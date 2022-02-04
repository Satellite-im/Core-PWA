import { ChatState } from './types'
import { ReplyObj, ChatTextObj, UploadedFiles } from '~/types/chat/chat'
import { add } from 'lodash'

const mutations = {
  setChatText(state: ChatState, req: ChatTextObj) {
    state.chatTexts.some((item) => item.userId === req.userId)
      ? state.chatTexts.forEach((item) => {
          if (item.userId === req.userId) {
            item.value = req.value
          }
        })
      : state.chatTexts.push(req)
  },
  setChatReply(state: ChatState, req: ReplyObj) {
    state.replies.some((item) => item.replyId === req.replyId)
      ? state.replies.forEach((item) => {
          if (item.replyId === req.replyId) {
            item.value = req.value
          }
        })
      : state.replies.push(req)
  },
  addUploadedFile(
    state: ChatState,
    {
      file,
      address,
    }: {
      file: UploadedFiles
      address: string
    },
  ) {
    state.uploadedFiles[address]
      ? state.uploadedFiles[address].push(file)
      : (state.uploadedFiles[address] = [file])
  },
  resetAllUploadedFiles(state: ChatState) {
    state.uploadedFiles = {}
  },
  clearUploadedFiles(state: ChatState, address: string) {
    state.uploadedFiles[address].splice(0, state.uploadedFiles[address].length)
  },
  removeUploadedFile(
    state: ChatState,
    {
      address,
      index,
    }: {
      address: string
      index: number
    },
  ) {
    state.uploadedFiles[address].splice(index, 1)
  },
  initUploadedFiles(state: ChatState, address: string) {
    state.uploadedFiles[address] ||= []
  },
}

export default mutations
