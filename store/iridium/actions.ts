import { divide } from 'cypress/types/lodash'
import { User } from '../friends/types'
import { IridiumError, IridiumState } from './types'
import { ActionsArguments } from '~/types/store/store'
import { IridiumWalletConfig } from '~/types/iridium/manager'
import iridium from '~/libraries/Iridium/IridiumManager'
import logger from '~/plugins/local/logger'
import { Config } from '~/config'
import {
  db,
  DexieConversation,
  DexieMessage,
} from '~/libraries/SatelliteDB/SatelliteDB'
import {
  MessageRouteEnum,
  MessagingTypesEnum,
  PropCommonEnum,
} from '~/libraries/Enums/enums'
import { AlertType } from '~/libraries/ui/Alerts'

import { Message } from '~/types/textile/mailbox'
import { MessageGroup } from '~/types/messaging'
import FriendsManager from '~/libraries/Iridium/friends/FriendsManager'

export default {
  /**
   * @description Initializes the TextileManager class and retrieves the
   * Textile public key that must be shared to friends in order to receive
   * messages
   * @param param0 Action Arguments
   * @param config Textile configuration (id, pass, wallet)
   */
  async initialize(
    { commit }: ActionsArguments<IridiumState>,
    config: IridiumWalletConfig,
  ) {
    await iridium.init(config)
    /* commit(
      'accounts/setAccountIds',
      {
        did: iridium.connector?.id,
        peerId: iridium.connector?.peerId,
      },
      { root: true },
    ) */

    /* Log CSAM Consent Data for future ticket as Hogan requested */
    logger.log('CSAM Consent Data', 'CSAM', iridium.profile?.state)
    commit('setInitialized', true)
  },
  async fetchMessages(
    { commit, rootState, dispatch }: ActionsArguments<IridiumState>,
    { did, setActive = false }: { did: string; setActive: boolean },
  ) {
    if (!rootState.iridium.initialized) {
      throw new Error(IridiumError.MAILBOX_MANAGER_NOT_FOUND)
    }

    const friend = iridium.friends?.state.details?.[did]

    if (!friend) {
      throw new Error(IridiumError.FRIEND_NOT_FOUND)
    }

    commit('setConversationLoading', { loading: true })

    const query = { limit: Config.chat.defaultMessageLimit, skip: 0 }

    let conversation = []

    const dbMessages: DexieMessage[] =
      (await db.conversationMessages.where({ conversation: did }).toArray()) ||
      []

    const lastDbInbound = dbMessages.reduce(
      (max, msg) => Math.max(max, msg.at),
      0,
    )

    const lastInbound = Math.max(
      lastDbInbound,
      rootState.iridium.conversations[did]?.lastInbound ?? 0,
    )

    // if nothing stored in indexeddb, fetch entire conversation
    if (!dbMessages.length) {
      const { message: messages } = await iridium.chat?.getConversation(did)

      conversation = Object.keys(messages).map((key) => ({
        id: key,
        ...messages[key],
      }))
    }
    // otherwise, combine new textile messages with stored messages
    else {
      const { message: messages } = await iridium.chat?.getConversation(did)

      conversation = [
        ...Object.keys(messages).map((key) => ({
          id: key,
          ...messages[key],
        })),
        // ...dbMessages.filter((d) => !ids.has(d.id)),
      ]
    }

    // Since this is async, we have to check that we are still in the chat, if
    // the user has navigated to a different chat, we can just return early so
    // we don't update the state with old information (prevents the toolbar
    // from showing the wrong participant info when navigating between
    // different conversations rapidly)
    if (rootState.conversation.id !== friend.peerId) {
      return
    }

    // store latest data in indexeddb
    const messages = conversation.map((c) => ({ ...c, conversation: did }))
    const dbData: DexieConversation = {
      key: did,
      lastInbound,
    }
    db.conversations.put(dbData)
    db.conversationMessages.bulkPut(messages)
    // add the messages to the search index
    db.search.conversationMessages.upsertAll(messages)

    // set active conversation only if we still on the chat
    const isChatRoute = !!this.$router.currentRoute.params?.address

    if (setActive && isChatRoute) {
      commit('setActiveConversation', friend.did)
      if (friend.peerId) {
        commit(
          'conversation/setConversation',
          {
            id: friend.peerId,
            type: 'friend',
            calling: false,
            participants: [],
          },
          { root: true },
        )
        dispatch('conversation/addParticipant', friend.did, { root: true })
      }
    }

    commit('setConversation', {
      type: 'friend',
      did: friend.did,
      messages: conversation,
      limit: query.limit,
      skip: query.skip,
      active: setActive,
    })

    commit('friends/setActive', friend, { root: true })
    commit('setConversationLoading', { loading: false })
    commit('setMessageLoading', { loading: false })
  },
  async sendTextMessage(
    { commit, rootState, dispatch }: ActionsArguments<IridiumState>,
    { to, text }: { to: string; text: string },
  ) {
    if (!rootState.iridium.initialized) {
      throw new Error(IridiumError.MAILBOX_MANAGER_NOT_FOUND)
    }

    const friend = iridium.friends?.state.details?.[to]

    if (!friend) {
      throw new Error(IridiumError.FRIEND_NOT_FOUND)
    }

    commit('setMessageLoading', { loading: true })

    const timestamp = Date.now()

    await iridium.chat?.sendMessage(to, {
      from: iridium.connector?.id,
      type: 'direct',
      body: text,
      conversation: text,
      at: timestamp,
      attachments: [],
    })

    const { message: messages } = iridium.chat?.state.conversation[to]
    let message = {}

    Object.keys(messages).forEach((key) => {
      if (messages[key].at === timestamp) {
        message = { id: key, ...messages[key] }
      }
    })

    dispatch('addMessageToConversation', {
      did: friend.did,
      sender: MessageRouteEnum.OUTBOUND,
      message,
    })
    dispatch('storeMessage', { did: friend.did, message })
    commit('setMessageLoading', { loading: false })
  },
  async storeMessage(
    {}: ActionsArguments<IridiumState>,
    {
      did,
      message,
    }: {
      did: string
      message: Message
    },
  ) {
    db.conversations
      .where('key')
      .equals(did)
      .modify((conversation: DexieConversation) => {
        conversation.lastInbound = message.at
      })

    const msg = { conversation: did, ...message }
    // add the message to the search index
    db.search.conversationMessages.upsert(msg)

    // replace old message with new edited version
    if (message.editedAt) {
      db.conversationMessages.put(msg)
      return
    }

    // add regular message to indexeddb
    db.conversationMessages.add(msg)
  },
  addMessageToConversation(
    { state, commit, rootState, dispatch }: ActionsArguments<IridiumState>,
    {
      did,
      sender,
      message,
    }: {
      did: string
      sender: string
      message: Message
    },
  ) {
    const isActiveConversation = state.activeConversation === did

    let oldGroupedMessages: MessageGroup = []

    if (isActiveConversation) {
      oldGroupedMessages = state.conversations[did].groupedMessages
    }

    commit('addMessageToConversation', {
      did,
      sender,
      message,
    })

    if (isActiveConversation) {
      const { messages, isScrollOver, lastLoadedMessageId, offset } =
        rootState.chat.currentChat

      let messageId: string = ''

      if (message.type === MessagingTypesEnum.REACTION) {
        messageId = message.reactedTo
      } else if (message.type === MessagingTypesEnum.REPLY) {
        messageId = message.repliedTo
      } else {
        messageId = message.id
      }

      const newGroupedMessages = state.conversations[did].groupedMessages

      const isExistMessageIndex = messages.findIndex(
        (m: Message) => m.id === messageId,
      )

      // update existed message
      if (isExistMessageIndex !== -1) {
        const newMessages = [...messages]
        newMessages[isExistMessageIndex] = newGroupedMessages.find(
          (message) => message.id === messageId,
        )

        commit(
          'chat/setCurrentChat',
          {
            messages: newMessages,
          },
          { root: true },
        )
        return
      }

      // add new messages
      const diffGroupedMessages =
        newGroupedMessages.length - oldGroupedMessages.length

      if (diffGroupedMessages) {
        const newMessages = newGroupedMessages.slice(oldGroupedMessages.length)

        commit(
          'chat/setCurrentChat',
          {
            messages: messages.concat(newMessages),
            lastLoadedMessageId: !isScrollOver
              ? newMessages[newMessages.length - 1].id
              : lastLoadedMessageId,
            offset: offset - diffGroupedMessages,
          },
          { root: true },
        )
      }
    }
  },
  subscribeToConversations({
    commit,
    rootState,
    dispatch,
  }: ActionsArguments<IridiumState>) {
    if (!rootState.iridium.initialized) {
      throw new Error(IridiumError.MAILBOX_MANAGER_NOT_FOUND)
    }

    iridium.friends.state.list?.forEach((friend) => {
      dispatch('subscribeToConversation', {
        friend: iridium.friends.state.details?.[friend],
      })
    })
  },
  async subscribeToConversation(
    { commit, rootState, dispatch }: ActionsArguments<IridiumState>,
    {
      friend,
    }: {
      friend: User
    },
  ) {
    if (!rootState.iridium.initialized) {
      throw new Error(IridiumError.MAILBOX_MANAGER_NOT_FOUND)
    }

    if (friend) {
      await iridium.chat.subscribeToConversation(friend.did, async (event) => {
        let message = await iridium.connector.load(event.message)
        message = { id: event.message, ...message }

        dispatch('addMessageToConversation', {
          did: friend.did,
          sender: MessageRouteEnum.INBOUND,
          message,
        })

        dispatch(
          'ui/sendNotification',
          {
            message: 'New DM',
            from: friend.name,
            fromAddress: friend.did,
            title: `Notification`,
            imageHash: friend.photoHash,
            type: AlertType.DIRECT_MESSAGE,
          },
          { root: true },
        )

        dispatch('storeInMessage', { did: friend.did, message })
      })
      await iridium.chat.subscribeToChannel(friend.did)
    }
  },
  async storeInMessage(
    {}: ActionsArguments<IridiumState>,
    {
      did,
      message,
    }: {
      did: string
      message: Message
    },
  ) {
    db.conversations
      .where('key')
      .equals(did)
      .modify((conversation: DexieConversation) => {
        conversation.lastInbound = message.at
      })

    const msg = { conversation: did, ...message }
    if (message.editedAt) {
      db.conversationMessages
        .get(message.id)
        .then((oldMessage?: DexieMessage) => {
          if (oldMessage) {
            db.conversationMessages.put(msg)
          } else {
            db.conversationMessages.add(msg)
          }
        })
      return
    }

    // add regular message to indexeddb
    db.conversationMessages.add(msg)
  },
}
