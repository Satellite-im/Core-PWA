import { Conversation, TextileState } from './types'
import { MessageRouteEnum } from '~/libraries/Enums/enums'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'
import { Message } from '~/types/textile/mailbox'
import { updateMessageTracker } from '~/utilities/Messaging'
import { UserThreadData } from '~/types/textile/user'

const mutations = {
  textileInitialized(state: TextileState, status: boolean) {
    state.initialized = status
  },
  setActiveConversation(state: TextileState, address: string) {
    state.activeConversation = address
  },
  setConversation(
    state: TextileState,
    {
      address,
      type,
      messages,
      limit,
      skip,
      end,
      active = true,
    }: {
      address: string
      type: 'group' | 'friend'
      messages: Message[]
      limit: number
      skip: number
      end: boolean
      active: boolean
    },
  ) {
    const lastMessageUpdate = messages.length
      ? messages[messages.length - 1].at
      : 0

    const initialValues = {
      messages: state.conversations[address]?.messages || [],
      replies: state.conversations[address]?.replies || [],
      reactions: state.conversations[address]?.reactions || [],
      lastInbound: state.conversations[address]?.lastInbound || 0, // the last time a message was received by any member of conversation, EXCEPT account owner
      lastUpdate: state.conversations[address]?.lastUpdate || lastMessageUpdate, // the last time a message was received by any member of conversation, INCLUDING account owner
      lastMessage: state.conversations[address]?.lastMessage || null, // the last time a message was received by any member of conversation, INCLUDING account owner
    }

    const tracked = updateMessageTracker(messages, initialValues)

    if (active) state.activeConversation = address
    const msgValues = Object.values(tracked.messages)

    state.conversations = {
      ...state.conversations,
      [address]: {
        type,
        messages: tracked.messages,
        replies: tracked.replies,
        reactions: tracked.reactions,
        lastInbound: initialValues.lastInbound, // the last time a message was received by any member of conversation, EXCEPT account owner
        lastUpdate: initialValues.lastUpdate, // the last time a message was received by any member of conversation, INCLUDING account owner
        lastMessage: msgValues[msgValues.length - 1],
        limit,
        skip,
        end,
      },
    }
  },
  resetConversation(state: TextileState, { address }: { address: string }) {
    state.conversations = <Conversation>{
      ...state.conversations,
      [address]: {
        messages: {},
        replies: {},
        reactions: {},
        lastInbound: 0, // the last time a message was received by any member of conversation, EXCEPT account owner
        lastUpdate: 0, // the last time a message was received by any member of conversation, INCLUDING account owner
        lastMessage: null,
        limit: 0,
        skip: 0,
        end: false,
      },
    }

    db.search.conversationMessages.removeAll()
  },
  addMessageToConversation(
    state: TextileState,
    {
      address,
      sender,
      message,
    }: { address: string; sender: string; message: Message },
  ) {
    if (!state.conversations[address]) {
      return
    }
    // No need to copy since we are going to update the whole conversation object
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

    // add to search index
    db.search.conversationMessages.upsert({ ...message, conversation: address })

    const tracked = updateMessageTracker([message], initialValues)
    const msgValues = Object.values(tracked.messages)

    state.conversations = <Conversation>{
      ...state.conversations,
      [address]: {
        messages: tracked.messages,
        replies: tracked.replies,
        reactions: tracked.reactions,
        lastInbound:
          sender !== MessageRouteEnum.OUTBOUND ? message.at : lastInbound, // the last time a message was received by any member of conversation, EXCEPT account owner
        lastUpdate: msgValues[msgValues.length - 1]?.at, // the last time a message was received by any member of conversation, INCLUDING account owner
        lastMessage: msgValues[msgValues.length - 1],
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
          progress,
          finished: false,
          name,
        },
      }
    }
    if (progress === 100) {
      state.uploadProgress = {
        ...state.uploadProgress,
        [name]: {
          progress,
          finished: true,
          name,
        },
      }
    }
  },
  setUserThreadData(state: TextileState, data: UserThreadData) {
    state.threadData = data
  },
}

export default mutations
