import { Conversation, TextileState } from './types'
import { MessageRouteEnum } from '~/libraries/Enums/enums'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'
import { Message } from '~/types/textile/mailbox'
import { groupMessages, updateMessageTracker } from '~/utilities/Messaging'
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
      groupedMessages: state.conversations[address]?.groupedMessages || [],
      lastInbound: state.conversations[address]?.lastInbound || 0, // the last time a message was received by any member of conversation, EXCEPT account owner
      lastUpdate: state.conversations[address]?.lastUpdate || lastMessageUpdate, // the last time a message was received by any member of conversation, INCLUDING account owner
      lastMessage: state.conversations[address]?.lastMessage || null, // the last time a message was received by any member of conversation, INCLUDING account owner
    }

    const tracked = updateMessageTracker(messages, initialValues)

    if (active) state.activeConversation = address
    const msgValues = Object.values(tracked.messages)

    const groupedMessages = groupMessages(
      tracked.messages,
      tracked.replies,
      tracked.reactions,
    )

    state.conversations = {
      ...state.conversations,
      [address]: {
        type,
        messages: tracked.messages,
        replies: tracked.replies,
        reactions: tracked.reactions,
        groupedMessages,
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
        groupedMessages: [],
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

    const groupedMessages = groupMessages(
      tracked.messages,
      tracked.replies,
      tracked.reactions,
    )

    state.conversations = <Conversation>{
      ...state.conversations,
      [address]: {
        messages: tracked.messages,
        replies: tracked.replies,
        reactions: tracked.reactions,
        groupedMessages,
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
  setUserThreadData(state: TextileState, data: UserThreadData) {
    state.userThread = data
  },
  setFileSystem(state: TextileState, data: TextileState['fileSystem']) {
    state.fileSystem = data
  },
}

export default mutations
