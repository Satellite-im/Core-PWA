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
      lastMsgReceived: state.conversations[address]?.lastMsgReceived || 0,
      lastConvoUpdate: state.conversations[address]?.lastConvoUpdate || 0,
    }

    const tracked = updateMessageTracker(messages, initialValues)

    state.conversations = {
      ...state.conversations,
      [address]: {
        messages: tracked.messages,
        replies: tracked.replies,
        reactions: tracked.reactions,
        lastMsgReceived: initialValues.lastMsgReceived,
        lastConvoUpdate: initialValues.lastConvoUpdate,
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
        lastMsgReceived: 0,
        lastConvoUpdate: 0,
        limit: 0,
        skip: 0,
        end: false,
      },
    }
  },
  addMessageToConversation(
    state: TextileState,
    { address, sender, message }: { address: string; sender:string; message: Message }
  ) {
    // No need to copy since we are going to
    // update the whole conversation object
    const { messages, replies, reactions, lastMsgReceived, lastConvoUpdate, limit, skip, end } =
      state.conversations[address]

    const initialValues = {
      messages,
      replies,
      reactions,
      lastMsgReceived,
      lastConvoUpdate,
    }

    const tracked = updateMessageTracker([message], initialValues)

    state.conversations = {
      ...state.conversations,
      [address]: {
        messages: tracked.messages,
        replies: tracked.replies,
        reactions: tracked.reactions,
        lastMsgReceived: (sender !== 'self' ? message.at : lastMsgReceived),
        lastConvoUpdate: message.at,
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
