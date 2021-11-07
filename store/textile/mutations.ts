import { TextileState } from './types'
import { Message } from '~/types/textile/mailbox'
import { updateMessageTracker } from '~/utilities/Messaging'

const mutations = {
  textileInitialized(state: TextileState, status: boolean) {
    state.initialized = status
  },
  setConversation(
    state: TextileState,
    {
      address,
      messages,
      limit,
      skip,
      end,
    }: {
      address: string
      messages: Message[]
      limit: number
      skip: number
      end: boolean
    }
  ) {
    const initialValues = {
      messages: state.conversations[address]?.messages || [],
      replies: state.conversations[address]?.replies || [],
      reactions: state.conversations[address]?.reactions || [],
    }

    const tracked = updateMessageTracker(messages, initialValues)

    state.conversations = {
      ...state.conversations,
      [address]: {
        messages: tracked.messages,
        replies: tracked.replies,
        reactions: tracked.reactions,
        limit,
        skip,
        end,
      },
    }
  },
  resetConversation(state: TextileState, { address }: { address: string }) {
    state.conversations = {
      ...state.conversations,
      [address]: {
        messages: {},
        replies: {},
        reactions: {},
        limit: 0,
        skip: 0,
        end: false,
      },
    }
  },
  addMessageToConversation(
    state: TextileState,
    { address, message }: { address: string; message: Message }
  ) {
    // No need to copy since we are going to
    // update the whole conversation object
    const { messages, replies, reactions, limit, skip, end } =
      state.conversations[address]

    const initialValues = {
      messages,
      replies,
      reactions,
    }

    const tracked = updateMessageTracker([message], initialValues)

    state.conversations = {
      ...state.conversations,
      [address]: {
        messages: tracked.messages,
        replies: tracked.replies,
        reactions: tracked.reactions,
        limit,
        skip,
        end,
      },
    }
  },
  setConversationLoading(
    state: TextileState,
    { loading }: { loading: boolean }
  ) {
    state.conversationLoading = loading
  },
}

export default mutations
