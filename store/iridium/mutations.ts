import { IridiumState } from './types'
import logger from '~/plugins/local/logger'
import { groupMessages, updateMessageTracker } from '~/utilities/Messaging'
import { MessageRouteEnum } from '~/libraries/Enums/enums'
import { Message } from '~/types/textile/mailbox'
import { db } from '~/libraries/SatelliteDB/SatelliteDB'

const mutations = {
  setInitialized(state: IridiumState, initialized: boolean = true) {
    logger.log('iridium/store/mutations', 'setInitialized()', { initialized })
    state.initialized = initialized
  },
  setActiveConversation(state: IridiumState, conversationId: string) {
    state.activeConversation = conversationId
  },
  setConversationLoading(
    state: IridiumState,
    { loading }: { loading: boolean },
  ) {
    state.conversationLoading = loading
  },
  setMessageLoading(state: IridiumState, { loading }: { loading: boolean }) {
    state.messageLoading = loading
  },
  setConversation(
    state: IridiumState,
    {
      did,
      type,
      messages,
      limit,
      skip,
      end,
      active = true,
    }: {
      did: string
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
      messages: state.conversations[did]?.messages || [],
      replies: state.conversations[did]?.replies || [],
      reactions: state.conversations[did]?.reactions || [],
      groupedMessages: state.conversations[did]?.groupedMessages || [],
      lastInbound: state.conversations[did]?.lastInbound || 0, // the last time a message was received by any member of conversation, EXCEPT account owner
      lastUpdate: state.conversations[did]?.lastUpdate || lastMessageUpdate, // the last time a message was received by any member of conversation, INCLUDING account owner
      lastMessage: state.conversations[did]?.lastMessage || null, // the last time a message was received by any member of conversation, INCLUDING account owner
    }

    const tracked = updateMessageTracker(messages, initialValues)

    if (active) state.activeConversation = did
    const msgValues = Object.values(tracked.messages)

    const groupedMessages = groupMessages(
      tracked.messages,
      tracked.replies,
      tracked.reactions,
    )

    state.conversations = {
      ...state.conversations,
      [did]: {
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
  addMessageToConversation(
    state: IridiumState,
    { did, sender, message }: { did: string; sender: string; message: Message },
  ) {
    if (!state.conversations[did]) {
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
    } = state.conversations[did]

    const initialValues = {
      messages,
      replies,
      reactions,
      lastInbound, // the last time a message was received by any member of conversation, EXCEPT account owner
      lastUpdate, // the last time a message was received by any member of conversation, INCLUDING account owner
    }

    // add to search index

    db.search.conversationMessages.upsert({ ...message, conversation: did })

    const tracked = updateMessageTracker([message], initialValues)
    const msgValues = Object.values(tracked.messages)

    const groupedMessages = groupMessages(
      tracked.messages,
      tracked.replies,
      tracked.reactions,
    )

    state.conversations = {
      ...state.conversations,
      [did]: {
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
}

export default mutations
