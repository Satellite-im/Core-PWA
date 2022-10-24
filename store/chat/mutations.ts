import Vue from 'vue'
import { ChatState, ChatFileUpload } from '~/store/chat/types'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'

const mutations = {
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
      ? state.files[id]?.push(file)
      : Vue.set(state.files, id, [file])
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
    state.files[id]?.splice(index, 1)
  },
  // setFileProgress(
  //   state: ChatState,
  //   {
  //     id,
  //     index,
  //     progress,
  //   }: { id: Conversation['id']; index: number; progress: number },
  // ) {
  //   state.files[id][index].progress = progress
  // },
  deleteFiles(state: ChatState, address: string) {
    Vue.delete(state.files, address)
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
  setReplyChatbarMessage(
    state: ChatState,
    {
      conversationId,
      message,
    }: { conversationId: Conversation['id']; message: ConversationMessage },
  ) {
    Vue.set(state.replyChatbarMessages, conversationId, message)
  },
  clearReplyChatbarMessage(
    state: ChatState,
    { conversationId }: { conversationId: Conversation['id'] },
  ) {
    Vue.delete(state.replyChatbarMessages, conversationId)
  },
  setActiveUploadChat(state: ChatState, id: Conversation['id']) {
    state.activeUploadChats.push(id)
  },
  removeActiveUploadChat(state: ChatState, id: Conversation['id']) {
    state.activeUploadChats.splice(state.activeUploadChats.indexOf(id), 1)
  },
  setEnhancersRoute(state: ChatState, route: ChatState['enhancersRoute']) {
    state.enhancersRoute = route
  },
  setMessageReaction(state: ChatState, val: ChatState['messageReaction']) {
    Vue.set(state, 'messageReaction', val)
  },
}

export default mutations
