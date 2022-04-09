import { ChatState } from './types'
import { ReplyObj, ChatTextObj } from '~/types/chat/chat'
import { UploadDropItemType } from '~/types/files/file'

const mutations = {
  chatText(state: ChatState, req: ChatTextObj) {
    state.chatTexts = state.chatTexts.some((item) => item.userId === req.userId)
      ? state.chatTexts.map((item) => {
          if (item.userId === req.userId) {
            return { ...item, value: req.value }
          }
          return item
        })
      : state.chatTexts.concat(req)
  },
  setChatReply(state: ChatState, req: ReplyObj) {
    state.replies = state.replies.some((item) => item.replyId === req.replyId)
      ? state.replies.map((item) => {
          if (item.replyId === req.replyId) {
            return { ...item, value: req.value }
          }
          return item
        })
      : state.replies.concat(req)
  },
  addFile(
    state: ChatState,
    {
      file,
      address,
    }: {
      file: UploadDropItemType
      address: string
    },
  ) {
    state.files[address]
      ? state.files[address].push(file)
      : (state.files[address] = [file])
  },
  setFiles(
    state: ChatState,
    {
      files,
      address,
    }: {
      files: UploadDropItemType[]
      address: string
    },
  ) {
    state.files[address] = files
  },
  deleteFiles(state: ChatState, address: string) {
    delete state.files[address]
  },
  setCountError(state: ChatState, countError: Boolean) {
    state.countError = countError
  },
  setAlertNsfw(state: ChatState, alertNsfw: Boolean) {
    state.alertNsfw = alertNsfw
  },
  setShowFilePreview(state: ChatState, showFilePreview: Boolean) {
    state.showFilePreview = showFilePreview
  },
}

export default mutations
