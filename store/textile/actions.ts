import Vue from 'vue'
import { Update } from '@textile/hub-threads-client'
import { v4 as uuidv4 } from 'uuid'
import { TextileError, TextileState } from './types'
import {
  MessageRouteEnum,
  MessagingTypesEnum,
  PropCommonEnum,
} from '~/libraries/Enums/enums'
import { Config } from '~/config'
import { FilSystem } from '~/libraries/Files/FilSystem'
import {
  db,
  DexieConversation,
  DexieMessage,
} from '~/libraries/SatelliteDB/SatelliteDB'
import GroupChatsProgram from '~/libraries/Solana/GroupChatsProgram/GroupChatsProgram'
import SolanaManager from '~/libraries/Solana/SolanaManager/SolanaManager'
import { GroupChatManager } from '~/libraries/Textile/GroupChatManager'
import { MailboxManager } from '~/libraries/Textile/MailboxManager'
import TextileManager from '~/libraries/Textile/TextileManager'
import { AccountsError } from '~/store/accounts/types'
import { Group } from '~/store/groups/types'
import { ChatFileUpload } from '~/store/chat/types'
import {
  QueryOptions,
  SearchOrderType,
  UISearchResult,
  UISearchResultData,
  MatchTypesEnum,
} from '~/types/search/search'
import { AlertType } from '~/libraries/ui/Alerts'
import { ActionsArguments, RootState } from '~/types/store/store'
import { MailboxSubscriptionType, Message } from '~/types/textile/mailbox'
import { TextileConfig } from '~/types/textile/manager'
import { UserInfoManager } from '~/libraries/Textile/UserManager'
import { UserThreadData } from '~/types/textile/user'
import { MessageGroup } from '~/types/messaging'
import BlockchainClient from '~/libraries/BlockchainClient'

const getGroupChatProgram = (): GroupChatsProgram => {
  const $SolanaManager: SolanaManager = Vue.prototype.$SolanaManager
  return new GroupChatsProgram($SolanaManager)
}

const getGroup = (state: RootState, id: string): Group => {
  const group = state.groups.all.find((it) => it.id === id)
  if (!group) throw new Error(AccountsError.CANNOT_FIND_GROUP)
  return group
}

export default {
  /**
   * @description Initializes the TextileManager class and retrieves the
   * Textile public key that must be shared to friends in order to receive
   * messages
   * @param param0 Action Arguments
   * @param config Textile configuration (id, pass, wallet)
   */
  async initialize(
    { commit, dispatch }: ActionsArguments<TextileState>,
    config: TextileConfig,
  ) {},
  /**
   * @description Fetches messages that comes from a specific user
   * @param param0 Action Arguments
   * @param param1 An object containing the address of a friend where messages
   * you want to fetch comes from
   */
  async fetchMessages(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { address, setActive = false }: { address: string; setActive: boolean },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_FOUND)
    }

    const friend = rootState.friends.all.find((fr) => fr.address === address)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }

    commit('setConversationLoading', { loading: true })

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

    const query = { limit: Config.chat.defaultMessageLimit, skip: 0 }

    let conversation: Message[] = []

    const dbMessages: DexieMessage[] =
      (await db.conversationMessages
        .where({ conversation: address })
        .toArray()) || []

    const lastDbInbound = dbMessages.reduce(
      (max, msg) => Math.max(max, msg.at),
      0,
    )

    const lastInbound = Math.max(
      lastDbInbound,
      rootState.textile.conversations[address]?.lastInbound ?? 0,
    )

    // if nothing stored in indexeddb, fetch entire conversation
    if (!dbMessages.length) {
      conversation = await $MailboxManager.getConversation({
        friendIdentifier: friend.textilePubkey,
        query,
      })
    }
    // otherwise, combine new textile messages with stored messages
    else {
      const textileMessages = await $MailboxManager.getConversation({
        friendIdentifier: friend.textilePubkey,
        query,
        lastInbound,
      })

      // use textileMessages as primary source. this way, edited messages will use the newest version
      const ids = new Set(textileMessages.map((d) => d.id))
      conversation = [
        ...textileMessages,
        ...dbMessages.filter((d) => !ids.has(d.id)),
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
    const messages = conversation.map((c) => ({ ...c, conversation: address }))
    const dbData: DexieConversation = {
      key: address,
      lastInbound,
    }
    db.conversations.put(dbData)
    db.conversationMessages.bulkPut(messages)
    // add the messages to the search index
    db.search.conversationMessages.upsertAll(messages)

    // set active conversation only if we still on the chat
    const isChatRoute = !!this.$router.currentRoute.params?.address

    if (setActive && isChatRoute) {
      commit('setActiveConversation', friend.address)
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
        dispatch('conversation/addParticipant', friend.address, { root: true })
      }
    }

    commit('setConversation', {
      type: 'friend',
      address: friend.address,
      messages: conversation,
      limit: query.limit,
      skip: query.skip,
      active: setActive,
    })

    commit('friends/setActive', friend, { root: true })
    commit('setConversationLoading', { loading: false })
    commit('setMessageLoading', { loading: false })

    // TODO: only for testing
    dispatch('subscribeToMailbox')
  },
  addMessageToConversation(
    { state, commit, rootState, dispatch }: ActionsArguments<TextileState>,
    {
      address,
      sender,
      message,
    }: { address: string; sender: string; message: Message },
  ) {
    const isActiveConversation = state.activeConversation === address

    let oldGroupedMessages: MessageGroup = []

    if (isActiveConversation) {
      oldGroupedMessages = state.conversations[address].groupedMessages
    }

    commit('addMessageToConversation', {
      address,
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

      const newGroupedMessages = state.conversations[address].groupedMessages

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
  /**
   * @description Subscribes to the user mailbox, if not already subscribed, and eventually
   * updates messages in the active chat
   * @param param0 Action Arguments
   */
  async subscribeToMailbox({
    rootState,
    dispatch,
  }: ActionsArguments<TextileState>) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    const MailboxManager = $TextileManager.mailboxManager

    if (!MailboxManager) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_FOUND)
    }

    if (!MailboxManager.isInitialized()) {
      await MailboxManager.init()
    }

    if (MailboxManager.isSubscribed(MailboxSubscriptionType.inbox)) {
      return
    }

    MailboxManager.listenToInboxMessages((message) => {
      if (!message) {
        return
      }
      const sender = rootState.friends.all.find(
        (friend) => friend.textilePubkey === message.from,
      )

      if (!sender) {
        return
      }

      dispatch('addMessageToConversation', {
        address: sender.address,
        sender: MessageRouteEnum.INBOUND,
        message,
      })

      dispatch(
        'ui/sendNotification',
        {
          message: 'New DM',
          from: sender.name,
          fromAddress: sender.address,
          title: `Notification`,
          imageHash: sender.profilePicture,
          type: AlertType.DIRECT_MESSAGE,
        },
        { root: true },
      )

      dispatch('storeInMessage', { address: sender.address, message })
    })
  },
  /**
   * @description Subscribes to the user sentbox and eventually
   * appends sent messages to the active chat
   */
  async subscribeToSentbox() {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    const MailboxManager = $TextileManager.mailboxManager

    if (!MailboxManager) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_FOUND)
    }

    if (MailboxManager.isSubscribed(MailboxSubscriptionType.sentbox)) {
      return
    }

    MailboxManager.listenToSentboxMessages((message) => {
      Vue.prototype.$Logger.log('WebRTC Sentbox', 'New message', message)
    })
  },
  /**
   * @description Sends a text message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key)
   * and the text message to be sent
   */
  async sendTextMessage(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { to, text }: { to: string; text: string },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    const friend = rootState.friends.all.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }

    commit('setMessageLoading', { loading: true })

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

    const result = await $MailboxManager.sendMessage<'text'>(
      friend.textilePubkey,
      {
        to: friend.textilePubkey,
        payload: text,
        type: 'text',
      },
    )

    dispatch('addMessageToConversation', {
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    dispatch('storeMessage', { address: friend.address, message: result })
    commit('setMessageLoading', { loading: false })
  },
  /**
   * @description Sends a File message to a given friend
   * @param param0 Action Arguments
   * @param param1 address, file to upload, address and index for updating upload progress in store
   * file: ChatFileUpload to be sent users bucket for textile
   */
  async sendFileMessage(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    {
      to,
      file,
      address,
      index,
    }: {
      to: string
      file: ChatFileUpload
      address: string
      index: number
    },
  ) {
    commit('setMessageLoading', { loading: true })
    document.body.style.cursor = PropCommonEnum.WAIT
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    const id = uuidv4()
    const res = await $TextileManager.sharedBucket?.pushFile(
      file.file,
      id,
      (progress: number) => {
        commit(
          'chat/setFileProgress',
          {
            address,
            index,
            progress: Math.floor((progress / file.file.size) * 100),
          },
          { root: true },
        )
      },
    )
    /* If already canceled */
    if (!rootState.textile.messageLoading) return
    const friend = rootState.friends.all.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }
    const sendFileResult =
      await $TextileManager.mailboxManager?.sendMessage<'file'>(
        friend.textilePubkey,
        {
          to: friend.textilePubkey,
          payload: {
            id,
            url: Config.textile.browser + res?.path.path,
            name: file.file.name,
            size: file.file.size,
            type: file.file.type,
            nsfw: file.nsfw,
          },
          type: 'file',
        },
      )

    dispatch('addMessageToConversation', {
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message: sendFileResult,
    })
    await dispatch('storeMessage', {
      address: friend.address,
      message: sendFileResult,
    })
    commit('setMessageLoading', { loading: false })
  },
  /**
   * @description Sends a reaction message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * the emoji and the id of the message the user reacted to
   */
  async sendReactionMessage(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { to, reactTo, emoji }: { to: string; reactTo: string; emoji: string },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    const friend = rootState.friends.all.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

    const result = await $MailboxManager.sendMessage<'reaction'>(
      friend.textilePubkey,
      {
        to: friend.textilePubkey,
        payload: emoji,
        reactedTo: reactTo,
        type: 'reaction',
      },
    )
    dispatch('addMessageToConversation', {
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    await dispatch('storeMessage', { address: friend.address, message: result })
  },
  /**
   * @description Sends a reply message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * the text message and the id of the message the user replied to
   */
  async sendReplyMessage(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    {
      to,
      replyTo,
      text,
      replyType,
    }: {
      to: string
      replyTo: string
      text: string
      replyType: 'file' | 'text' | 'media'
    },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    const friend = rootState.friends.all.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }

    commit(
      'ui/setReplyChatbarContent',
      {
        id: '',
        payload: '',
        from: '',
      },
      { root: true },
    )

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager
    const result = await $MailboxManager.sendMessage<'reply'>(
      friend.textilePubkey,
      {
        to: friend.textilePubkey,
        payload: text,
        repliedTo: replyTo,
        type: 'reply',
        replyType,
      },
    )

    dispatch('addMessageToConversation', {
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    await dispatch('storeMessage', { address: friend.address, message: result })
  },

  /**
   * @description Edit a text message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key)
   * and the text message to be sent
   */
  async editTextMessage(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { to, original, text }: { to: string; text: string; original: Message },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    const friend = rootState.friends.all.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager
    const editingMessage = {
      ...original,
      payload: text,
      editingAt: Date.now(),
    } as Message

    dispatch('addMessageToConversation', {
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message: editingMessage,
    })

    const result = await $MailboxManager.editMessage<'text'>(original.id, {
      to: friend.textilePubkey,
      payload: text,
      type: 'text',
    })

    if (result) {
      dispatch('addMessageToConversation', {
        address: friend.address,
        sender: MessageRouteEnum.OUTBOUND,
        message: result,
      })
      await dispatch('storeMessage', {
        address: friend.address,
        message: result,
      })
    } else {
      dispatch('addMessageToConversation', {
        address: friend.address,
        sender: MessageRouteEnum.OUTBOUND,
        message: original,
      })
      await dispatch('storeMessage', {
        address: friend.address,
        message: original,
      })
    }
  },
  /**
   * @description Sends a glyph message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * glyph to be sent, and pack name
   */
  async sendGlyphMessage(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { to, src, pack }: { to: string; src: string; pack: string },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    const friend = rootState.friends.all.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }

    commit('setMessageLoading', { loading: true })

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

    const result = await $MailboxManager.sendMessage<'glyph'>(
      friend.textilePubkey,
      {
        to: friend.textilePubkey,
        payload: src,
        pack,
        type: 'glyph',
      },
    )

    dispatch('addMessageToConversation', {
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    await dispatch('storeMessage', { address: friend.address, message: result })

    commit('setMessageLoading', { loading: false })
  },
  /**
   * @description Store a new sent message in indexeddb. If edited, replace old message
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address and message to be stored
   */
  async storeMessage(
    {}: ActionsArguments<TextileState>,
    {
      address,
      message,
    }: {
      address: string
      message: Message
    },
  ) {
    db.conversations
      .where('key')
      .equals(address)
      .modify((conversation: DexieConversation) => {
        conversation.lastInbound = message.at
      })

    const msg = { conversation: address, ...message }
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

  async storeInMessage(
    {}: ActionsArguments<TextileState>,
    {
      address,
      message,
    }: {
      address: string
      message: Message
    },
  ) {
    db.conversations
      .where('key')
      .equals(address)
      .modify((conversation: DexieConversation) => {
        conversation.lastInbound = message.at
      })

    const msg = { conversation: address, ...message }
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
  /**
   * @description Fetches messages that comes from a specific user
   * @param param0 Action Arguments
   * @param param1 An object containing the address of a friend where messages
   * you want to fetch comes from
   */
  async fetchGroupMessages(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { groupId, setActive = true }: { groupId: string; setActive: boolean },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    if (!$TextileManager.groupChatManager?.isInitialized()) {
      throw new Error(TextileError.EDIT_HOT_KEY_ERROR)
    }
    commit('setConversationLoading', { loading: true })
    const $GroupChatManager: GroupChatManager = $TextileManager.groupChatManager
    const query = { limit: Config.chat.defaultMessageLimit, skip: 0 }
    const group = getGroup(rootState, groupId)
    const conversation = await $GroupChatManager.getConversation({
      group,
      query,
    })

    // Since this is async, we have to check that we are still in the chat, if
    // the user has navigated to a different chat, we can just return early so
    // we don't update the state with old information (prevents the toolbar
    // from showing the wrong participant info when navigating between
    // different conversations rapidly)
    if (rootState.conversation.id !== groupId) {
      return
    }

    if (setActive) {
      dispatch(
        'conversation/setConversation',
        {
          id: groupId,
          type: 'group',
          calling: false,
          participants: [],
        },
        { root: true },
      )
      dispatch(
        'conversation/addParticipants',
        group.members.map((m) => m.address),
        { root: true },
      )
      commit('setActiveConversation', groupId)
    }

    commit('setConversation', {
      type: 'group',
      address: groupId,
      messages: conversation,
      limit: query.limit,
      skip: query.skip,
      active: setActive,
    })

    commit('setConversationLoading', { loading: false })
  },
  /**
   * @description Subscribes to the user sentbox and eventually
   * appends sent messages to the active chat
   */
  async subscribeToGroup(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { groupId }: { groupId: string },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    const MailboxManager = $TextileManager.mailboxManager
    const $BlockchainClient: BlockchainClient = BlockchainClient.getInstance()

    if (!MailboxManager) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_FOUND)
    }

    if (MailboxManager.isSubscribed(MailboxSubscriptionType.sentbox)) {
      return
    }
    if (!$TextileManager.groupChatManager?.isInitialized()) {
      throw new Error(TextileError.EDIT_HOT_KEY_ERROR)
    }
    if ($TextileManager.groupChatManager?.isSubscribed(groupId)) {
      return
    }
    let group: Group | undefined
    try {
      group = getGroup(rootState, groupId)
    } catch {}
    if (!group) return

    const $GroupChatManager: GroupChatManager = $TextileManager.groupChatManager
    await $GroupChatManager.listenToGroupMessages(async (message) => {
      if (!message) {
        return
      }

      dispatch('addMessageToConversation', {
        address: groupId,
        sender: MessageRouteEnum.INBOUND,
        message,
      })
      const userInfo = await $BlockchainClient.getUserInfo(message.sender)
      const urlMatch = groupId ? message.to : message.from
      await Promise.all([
        dispatch(
          'ui/sendNotification',
          {
            message: 'New DM',
            from: userInfo?.name,
            fromAddress: urlMatch,
            title: `Notification`,
            groupName: group?.name,
            groupId,
            id: uuidv4(),
            groupURL: message.to,
            imageHash: userInfo?.photoHash,
            type: AlertType.GROUP_MESSAGE,
          },
          { root: true },
        ),
        dispatch('storeInMessage', { address: groupId, message }),
      ])
    }, group)
  },
  /**
   * @description Fetches messages that comes from a specific user
   * @param param0 Action Arguments
   * @param param1 An object containing the address of a friend where messages
   * you want to fetch comes from
   */
  async sendGroupMessage(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { groupId, message }: { groupId: string; message: string },
  ) {
    try {
      const $TextileManager: TextileManager = Vue.prototype.$TextileManager

      if (!$TextileManager.groupChatManager?.isInitialized()) {
        throw new Error(TextileError.EDIT_HOT_KEY_ERROR)
      }
      const $GroupChatManager: GroupChatManager =
        $TextileManager.groupChatManager

      commit('setMessageLoading', { loading: true })
      const group = getGroup(rootState, groupId)

      const result = await $GroupChatManager
        .sendMessage<'text'>(group, {
          to: group.id,
          payload: message,
          type: 'text',
        })
        .catch((e) => {
          Vue.prototype.$Logger.log('textile/sendGroupMessage: error', e)
        })

      dispatch('addMessageToConversation', {
        address: groupId,
        sender: MessageRouteEnum.OUTBOUND,
        message: result,
      })
    } catch (e) {
      Vue.prototype.$Logger.log('textile/sendGroupMessage: error', e)
    } finally {
      commit('setMessageLoading', { loading: false })
    }
  },
  /**
   * @description Sends a glyph message to a given group
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * glyph to be sent, and pack name
   */
  async sendGroupGlyphMessage(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { groupID, src, pack }: { groupID: string; src: string; pack: string },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    commit('setMessageLoading', { loading: true })

    if (!$TextileManager.groupChatManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    const group = getGroup(rootState, groupID)

    const $GroupChatManager: GroupChatManager = $TextileManager.groupChatManager

    const result = await $GroupChatManager.sendMessage<'glyph'>(group, {
      to: groupID,
      payload: src,
      pack,
      type: 'glyph',
    })

    dispatch('addMessageToConversation', {
      address: groupID,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    dispatch('storeMessage', { address: groupID, message: result })

    commit('setMessageLoading', { loading: false })
  },
  /**
   * @description Sends a File message to a given group
   * @param param0 Action Arguments
   * @param param1 address, file to upload, address and index for updating upload progress in store
   * file: ChatFileUpload to be sent users bucket for textile
   */
  async sendGroupFileMessage(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    {
      groupID,
      file,
      address,
      index,
    }: {
      groupID: string
      file: ChatFileUpload
      address: string
      index: number
    },
  ) {
    document.body.style.cursor = PropCommonEnum.WAIT
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    const group = getGroup(rootState, groupID)
    const id = uuidv4()
    const res = await $TextileManager.sharedBucket?.pushFile(
      file.file,
      id,
      (progress: number) => {
        commit(
          'chat/setFileProgress',
          {
            address,
            index,
            progress: Math.floor((progress / file.file.size) * 100),
          },
          { root: true },
        )
      },
    )

    const sendFileResult =
      await $TextileManager.groupChatManager?.sendMessage<'file'>(group, {
        to: groupID,
        payload: {
          id,
          url: Config.textile.browser + res?.path.path,
          name: file.file.name,
          size: file.file.size,
          type: file.file.type,
          nsfw: file.nsfw,
        },
        type: 'file',
      })

    dispatch('addMessageToConversation', {
      address: groupID,
      sender: MessageRouteEnum.OUTBOUND,
      message: sendFileResult,
    })
    dispatch('storeMessage', {
      address: groupID,
      message: sendFileResult,
    })
  },
  /**
   * @description Sends a reply message to a given group
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * the text message and the id of the message the user replied to
   */
  async sendGroupReplyMessage(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    {
      to,
      replyTo,
      text,
      replyType,
    }: {
      to: string
      replyTo: string
      text: string
      replyType: 'file' | 'text' | 'media'
    },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    if (!$TextileManager.groupChatManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }
    const $GroupChatManager: GroupChatManager = $TextileManager.groupChatManager
    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    commit('setMessageLoading', { loading: true })
    commit(
      'ui/setReplyChatbarContent',
      {
        id: '',
        payload: '',
        from: '',
      },
      { root: true },
    )

    const result = await $GroupChatManager.sendMessage<'reply'>(to, {
      to,
      payload: text,
      repliedTo: replyTo,
      type: 'reply',
      replyType,
    })

    dispatch('addMessageToConversation', {
      address: to,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    dispatch('storeMessage', { address: to, message: result })
    commit('setMessageLoading', { loading: false })
  },
  /**
   * @description Sends a reaction message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * the emoji and the id of the message the user reacted to
   */
  async sendGroupReactionMessage(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { to, reactTo, emoji }: { to: string; reactTo: string; emoji: string },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    if (!$TextileManager.groupChatManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }
    const $GroupChatManager: GroupChatManager = $TextileManager.groupChatManager
    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }
    const result = await $GroupChatManager.sendMessage<'reaction'>(to, {
      to,
      payload: emoji,
      reactedTo: reactTo,
      type: 'reaction',
    })
    dispatch('addMessageToConversation', {
      address: to,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    dispatch('storeMessage', { address: to, message: result })
  },
  /**
   * @description Search for text within the specified conversations
   * @param param0 Action Arguments
   * @param param1 an object containing the query options, accounts, page, and limit,
   * @returns  search result object
   */
  async searchConversations(
    { state }: ActionsArguments<TextileState>,
    {
      query,
      page,
      orderBy,
      fields,
    }: {
      query: QueryOptions
      page: number
      orderBy: SearchOrderType
      fields: MatchTypesEnum[]
    },
  ): Promise<UISearchResult> {
    const { queryString, accounts, dateRange, perPage } = query

    const startDate =
      dateRange && new Date(dateRange.start).setHours(0, 0, 0, 0).valueOf()
    const endDate =
      dateRange && new Date(dateRange.end).setHours(23, 59, 59, 999).valueOf()

    // this rebuilds search indexes when changes are made to them with HMR
    if (!db.search.conversationMessages) {
      await db.initializeSearchIndexes()
    }

    const result: UISearchResultData[] = db.search.conversationMessages.search(
      `${queryString}${
        startDate && endDate
          ? ` AND at >= ${startDate} AND at <= ${endDate}`
          : ''
      }`,
      {
        fuzzy: 0.3,
        fields,
        filter: (result) => result.conversation === state.activeConversation,
      },
    )

    const skip = (page - 1) * perPage
    const data = result?.map((match) => ({
      ...match,
      user: accounts.find((acct) => acct?.textilePubkey === match.from),
    }))
    if (orderBy === SearchOrderType.New) {
      data.sort((a: UISearchResultData, b: UISearchResultData) => b.at - a.at)
    }
    if (orderBy === SearchOrderType.Old) {
      data.sort((a: UISearchResultData, b: UISearchResultData) => a.at - b.at)
    }
    if (orderBy === SearchOrderType.Relevant) {
      data.sort(
        (a: UISearchResultData, b: UISearchResultData) => b.score - a.score,
      )
    }
    return { data: data.slice(skip, perPage * page), totalRows: result?.length }
  },

  /**
   * @description update threaddb record, then reflect the update in store.
   * do not await threaddb work so the toggle switch is smooth
   */
  async updateUserThreadData(
    { commit }: ActionsArguments<TextileState>,
    {
      consentToScan,
      blockNsfw,
      flipVideo,
      filesVersion,
    }: {
      consentToScan?: boolean
      blockNsfw?: boolean
      flipVideo?: boolean
      filesVersion?: number
    },
  ) {
    const $UserInfoManager: UserInfoManager =
      Vue.prototype.$TextileManager.userInfoManager

    if (!$UserInfoManager) {
      throw new Error(TextileError.USERINFO_MANAGER_NOT_FOUND)
    }

    commit(
      'setUserThreadData',
      await $UserInfoManager.updateRecord({
        consentToScan,
        blockNsfw,
        flipVideo,
        filesVersion,
      }),
    )
  },
}
