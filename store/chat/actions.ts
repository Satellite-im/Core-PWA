import { ActionsArguments } from '~/types/store/store'
import { ScrollDirections } from '~/types/chat/chat'
import { ChatState, ChatText } from '~/store/chat/types'

export default {
  setChatText({ commit }: ActionsArguments<ChatState>, req: ChatText) {
    commit('chatText', req)
  },
  loadMessages(
    { state, commit, rootState }: ActionsArguments<ChatState>,
    conversationId: string,
  ) {
    if (!conversationId) {
      return
    }

    commit('setCurrentChat', { isMessagesLoading: true })

    const conversation = rootState.iridium.conversations[conversationId]

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
          ? newMessages.concat(messages)
          : messages.concat(newMessages),
      page: page + 1,
      isMessagesLoading: false,
      lastLoadedMessageId: getLastLoadedMessageId(),
    })
  },
}
