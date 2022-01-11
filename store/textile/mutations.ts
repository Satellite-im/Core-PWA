import { TextileState } from './types'
import { Message } from '~/types/textile/mailbox'
import { updateMessageTracker } from '~/utilities/Messaging'
import { MessageRouteEnum } from '~/libraries/Enums/enums'

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
    },
  ) {
    const initialValues = {
      messages: state.conversations[address]?.messages || [],
      replies: state.conversations[address]?.replies || [],
      reactions: state.conversations[address]?.reactions || [],
      lastInbound: state.conversations[address]?.lastInbound || 0, // the last time a message was received by any member of conversation, EXCEPT account owner
      lastUpdate: state.conversations[address]?.lastUpdate || 0, // the last time a message was received by any member of conversation, INCLUDING account owner
    }

    const tracked = updateMessageTracker(messages, initialValues)

    state.conversations = {
      ...state.conversations,
      [address]: {
        messages: tracked.messages,
        replies: tracked.replies,
        reactions: tracked.reactions,
        lastInbound: initialValues.lastInbound, // the last time a message was received by any member of conversation, EXCEPT account owner
        lastUpdate: initialValues.lastUpdate, // the last time a message was received by any member of conversation, INCLUDING account owner
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
        lastInbound: 0, // the last time a message was received by any member of conversation, EXCEPT account owner
        lastUpdate: 0, // the last time a message was received by any member of conversation, INCLUDING account owner
        limit: 0,
        skip: 0,
        end: false,
      },
    }
  },
  addMessageToConversation(
    state: TextileState,
    {
      address,
      sender,
      message,
    }: { address: string; sender: string; message: Message },
  ) {
    // No need to copy since we are going to
    // update the whole conversation object
    const {
      messages,
      replies,
      reactions,
      lastInbound,
      lastUpdate,
      limit,
      skip,
      end,
    } = state.conversations[address]

    const initialValues = {
      messages,
      replies,
      reactions,
      lastInbound, // the last time a message was received by any member of conversation, EXCEPT account owner
      lastUpdate, // the last time a message was received by any member of conversation, INCLUDING account owner
    }

    const tracked = updateMessageTracker([message], initialValues)
    state.conversations = {
      ...state.conversations,
      [address]: {
        messages: tracked.messages,
        replies: tracked.replies,
        reactions: tracked.reactions,
        lastInbound:
          sender !== MessageRouteEnum.OUTBOUND ? message.at : lastInbound, // the last time a message was received by any member of conversation, EXCEPT account owner
        lastUpdate: message.at, // the last time a message was received by any member of conversation, INCLUDING account owner
        limit,
        skip,
        end,
      },
    }
  },
  setConversationLoading(
    state: TextileState,
    { loading }: { loading: boolean },
  ) {
    state.conversationLoading = loading
  },
  setMessageLoading(state: TextileState, { loading }: { loading: boolean }) {
    state.messageLoading = loading
  },
  clearUploadProgress(state: TextileState) {
    state.uploadProgress = {}
  },
  setUploadingFileProgress(
    state: TextileState,
    {
      progress,
      name,
    }: {
      progress: number
      name: string
    },
  ) {
    if (progress !== 100) {
      state.uploadProgress = {
        ...state.uploadProgress,
        [name]: {
          progress: progress,
          finished: false,
          name: name,
        },
      }
    }
    if (progress === 100) {
      state.uploadProgress = {
        ...state.uploadProgress,
        [name]: {
          progress: progress,
          finished: true,
          name: name,
        },
      }
    }
  },
}

export default mutations
