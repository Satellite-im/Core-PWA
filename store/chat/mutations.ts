import Vue from 'vue'
import { ICurrentChat } from '~/types/chat/chat'
import { initialCurrentChat } from '~/store/chat/state'
import {
  ChatState,
  ChatReply,
  ChatText,
  ChatFileUpload,
} from '~/store/chat/types'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'

const mutations = {
  chatText(state: ChatState, req: ChatText) {
    state.chatTexts = state.chatTexts.some((item) => item.userId === req.userId)
      ? state.chatTexts.map((item) => {
          if (item.userId === req.userId) {
            return { ...item, value: req.value }
          }
          return item
        })
      : state.chatTexts.concat(req)
  },
  setChatReply(state: ChatState, req: ChatReply) {
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
      id,
    }: {
      file: ChatFileUpload
      id: Conversation['id']
    },
  ) {
    state.files[id]
      ? state.files[id].push(file)
      : Vue.set(state.files, id, [file])
    // Vue can't detect new objects automatically, hence set syntax https://forum.vuejs.org/t/mutation-not-updating-data-in-vuex/102124
  },
  removeFile(
    state: ChatState,
    {
      id,
      index,
    }: {
      id: Conversation['id']
      index: number
    },
  ) {
    state.files[id].splice(index, 1)
  },
  setFileProgress(
    state: ChatState,
    {
      id,
      index,
      progress,
    }: { id: Conversation['id']; index: number; progress: number },
  ) {
    state.files[id][index].progress = progress
  },
  deleteFiles(state: ChatState, address: string) {
    Vue.delete(state.files, address)
  },
  setCountError(state: ChatState, countError: boolean) {
    state.countError = countError
  },
  setCurrentChat(state: ChatState, currentChat: ICurrentChat) {
    state.currentChat = { ...state.currentChat, ...currentChat }
  },
  resetCurrentChat(state: ChatState) {
    state.currentChat = initialCurrentChat
  },
  setDraftMessage(
    state: ChatState,
    {
      conversationId,
      message,
    }: { conversationId: Conversation['id']; message: string },
  ) {
    Vue.set(state.draftMessages, conversationId, message)
  },
  setReplyChatbarMessage(state: ChatState, message: ConversationMessage) {
    state.replyChatbarMessage = message
  },
  clearReplyChatbarMessage(state: ChatState) {
    state.replyChatbarMessage = undefined
  },
}

export default mutations
