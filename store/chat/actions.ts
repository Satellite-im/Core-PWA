import { ChatState } from './types'
import { PropCommonEnum } from '~/libraries/Enums/enums'

import { ActionsArguments } from '~/types/store/store'
import { ChatTextObj, ScrollDirections } from '~/types/chat/chat'
import { UploadDropItemType } from '~/types/files/file'

export default {
  setChatText(
    { commit, dispatch }: ActionsArguments<ChatState>,
    req: ChatTextObj,
  ) {
    commit('chatText', req)
  },
  removeUploadItem(
    { commit, rootState, dispatch }: ActionsArguments<ChatState>,
    {
      itemIndex,
      files,
      recipientAddress,
    }: {
      itemIndex: number
      files: UploadDropItemType[]
      recipientAddress: string
    },
  ) {
    if (files.length === 1) {
      document.body.style.cursor = PropCommonEnum.DEFAULT
      commit('setCountError', false)
      commit('deleteFiles', recipientAddress)
      dispatch('textile/clearUploadStatus')
      if (rootState.textile.messageLoading)
        commit('textile/setMessageLoading', { loading: false })
    }

    commit('setFiles', {
      files: files.filter(
        (file: UploadDropItemType, i: number) => i !== itemIndex,
      ),
      address: recipientAddress,
    })
  },
  loadMessages(
    { state, commit, rootState }: ActionsArguments<ChatState>,
    conversationId: string,
  ) {
    if (!conversationId) {
      return
    }

    commit('setCurrentChat', { isMessagesLoading: true })

    const conversation = rootState.textile.conversations[conversationId]

    // if conversations are empty or found conversation does not have groupedMessages
    if (!conversation?.groupedMessages) {
      commit('setCurrentChat', { isMessagesLoading: false })
      return
    }

    const { groupedMessages: allMessages } = conversation

    const { messages, page, size, hasNextPage, direction, offset } =
      state.currentChat

    if (!hasNextPage) {
      return
    }

    let from: number
    let to: number

    switch (direction) {
      // from bottom to top
      case ScrollDirections.TOP:
        from = Math.max(allMessages?.length + offset - size * page, 0)
        to = Math.max(allMessages?.length + offset - size * (page - 1), 0)
        break
      // from top to bottom
      default:
        from = size * (page - 1)
        to = page * size
        break
    }

    const newMessages = allMessages?.slice(from, to)

    if (!newMessages?.length) {
      commit('setCurrentChat', {
        hasNextPage: false,
        isMessagesLoading: false,
        lastLoadedMessageId: messages[0] && messages[0].id,
      })
      return
    }

    const getLastLoadedMessageId = () => {
      if (direction === ScrollDirections.TOP) {
        return newMessages[newMessages.length - 1].id
      }
      return newMessages[0].id
    }

    commit('setCurrentChat', {
      messages:
        direction === ScrollDirections.TOP
          ? [...newMessages, ...messages]
          : [...messages, ...newMessages],
      page: page + 1,
      isMessagesLoading: false,
      lastLoadedMessageId: getLastLoadedMessageId(),
    })
  },
}
