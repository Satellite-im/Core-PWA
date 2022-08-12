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
          ? newMessages.concat(messages)
          : messages.concat(newMessages),
      page: page + 1,
      isMessagesLoading: false,
      lastLoadedMessageId: getLastLoadedMessageId(),
    })
  },

  /**
   * @description Search for text within the specified conversations
   * @param param0 Action Arguments
   * @param param1 an object containing the query options, accounts, page, and limit,
   * @returns  search result object
   */
  // async searchConversations(
  //   { state }: ActionsArguments<TextileState>,
  //   {
  //     query,
  //     page,
  //     orderBy,
  //     fields,
  //   }: {
  //     query: QueryOptions
  //     page: number
  //     orderBy: SearchOrderType
  //     fields: MatchTypesEnum[]
  //   },
  // ): Promise<UISearchResult> {
  //   const { queryString, accounts, dateRange, perPage } = query

  //   const startDate =
  //     dateRange && new Date(dateRange.start).setHours(0, 0, 0, 0).valueOf()
  //   const endDate =
  //     dateRange && new Date(dateRange.end).setHours(23, 59, 59, 999).valueOf()

  //   // this rebuilds search indexes when changes are made to them with HMR
  //   if (!db.search.conversationMessages) {
  //     await db.initializeSearchIndexes()
  //   }

  //   const result: UISearchResultData[] = db.search.conversationMessages.search(
  //     `${queryString}${
  //       startDate && endDate
  //         ? ` AND at >= ${startDate} AND at <= ${endDate}`
  //         : ''
  //     }`,
  //     {
  //       fuzzy: 0.3,
  //       fields,
  //       filter: (result) => result.conversation === state.activeConversation,
  //     },
  //   )

  //   const skip = (page - 1) * perPage
  //   const data = result?.map((match) => ({
  //     ...match,
  //     user: accounts.find((acct) => acct?.textilePubkey === match.from),
  //   }))
  //   if (orderBy === SearchOrderType.New) {
  //     data.sort((a: UISearchResultData, b: UISearchResultData) => b.at - a.at)
  //   }
  //   if (orderBy === SearchOrderType.Old) {
  //     data.sort((a: UISearchResultData, b: UISearchResultData) => a.at - b.at)
  //   }
  //   if (orderBy === SearchOrderType.Relevant) {
  //     data.sort(
  //       (a: UISearchResultData, b: UISearchResultData) => b.score - a.score,
  //     )
  //   }
  //   return { data: data.slice(skip, perPage * page), totalRows: result?.length }
  // },
}
