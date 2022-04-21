import db, { dbActions } from './db'
import state from './state'
import { dispatch } from './helpers'
import { TextileError, WorkerActionPayload, WorkerActions } from './types'

import { Friend } from '~/types/ui/friends'
import { Config } from '~/config'
import { MailboxSubscriptionType, Message } from '~/types/textile/mailbox'
import {
  DexieConversation,
  DexieMessage,
} from '~/libraries/SatelliteDB/SatelliteDB'
import { MessageRouteEnum } from '~/libraries/Enums/enums'
import TextileManager from '~/libraries/Textile/TextileManager'
import { Group } from '~/types/ui/core'
import { AccountsError } from '~/store/accounts/types'

export const textile = new TextileManager()
export default textile

export const textileActions: WorkerActions = {
  getConversation: async ({
    address,
    setActive = false,
  }: WorkerActionPayload) => {
    if (!textile.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.EDIT_HOT_KEY_ERROR)
    }

    const friend = state.friends.find(
      (friend: Friend) => friend.address === address,
    )

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }

    dispatch('conversation/setLoading', { loading: true })

    const query = { limit: Config.chat.defaultMessageLimit, skip: 0 }

    let conversation: Message[] = []

    const dbMessages: DexieMessage[] =
      (await db.conversationMessages
        .where({ conversation: address })
        .toArray()) || []

    const lastInbound = state.conversations[address].lastInbound ?? 0

    // if nothing stored in indexeddb, fetch entire conversation
    if (!dbMessages.length) {
      conversation = await textile.mailboxManager.getConversation({
        friendIdentifier: friend.textilePubkey,
        query,
      })
    }
    // otherwise, combine new textile messages with stored messages
    else {
      const textileMessages = await textile.mailboxManager.getConversation({
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

    // store latest data in indexeddb
    const messages = conversation.map((c) => ({
      ...c,
      conversation: address,
    }))
    const dbData: DexieConversation = {
      key: address,
      lastInbound,
    }
    db.conversations.put(dbData)
    db.conversationMessages.bulkPut(messages)
    db.search.conversationMessages.addAll(messages)

    dispatch('conversation/update', {
      address: friend.address,
      messages: conversation,
      limit: query.limit,
      skip: query.skip,
      active: setActive,
      loading: false,
      messageLoading: false,
    })

    dispatch('friends/setActive', friend)
  },
  subscribeToMailbox: async () => {
    if (!textile?.mailboxManager) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_FOUND)
    }

    if (textile.mailboxManager.isSubscribed(MailboxSubscriptionType.inbox)) {
      return
    }

    textile.mailboxManager.listenToInboxMessages((message) => {
      if (!message) {
        return
      }

      const sender = state.friends.find(
        (friend) => friend.textilePubkey === message.from,
      )

      if (!sender) {
        return
      }

      dispatch('conversations/addMessage', {
        address: sender.address,
        sender: MessageRouteEnum.INBOUND,
        message,
      })
    })
  },
  subscribeToSentbox: async ({ address }: WorkerActionPayload) => {
    if (!textile.mailboxManager) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_FOUND)
    }

    if (textile.mailboxManager.isSubscribed(MailboxSubscriptionType.sentbox)) {
      return
    }

    textile.mailboxManager.listenToSentboxMessages((message) => {
      dispatch('conversations/sentMessage', { message })
    })
  },
  sendTextMessage: async ({ to, text }: WorkerActionPayload) => {
    if (!textile.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    const friend = state.friends.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }

    dispatch('conversation/setLoading', { message: true })

    const message = await textile.mailboxManager.sendMessage<'text'>(
      friend.textilePubkey,
      {
        to: friend.textilePubkey,
        payload: text,
        type: 'text',
      },
    )

    dbActions.storeConversationMessage({ address: friend.address, message })
    dispatch('conversation/setLoading', { message: false })
  },
  setLoading: ({
    conversation = true,
    message = true,
  }: {
    conversation?: boolean
    message?: boolean
  }) => {
    state.textile.conversationLoading = conversation
    state.textile.messageLoading = message
    dispatch('conversation/setLoading', { conversation, message })
  },
  /**
   * @description add a message to the conversation
   * @param address
   * @param message
   * @param sender
   */
  addMessageToConversation: ({
    address,
    message,
    sender = MessageRouteEnum.OUTBOUND,
  }: WorkerActionPayload) => {
    dispatch('conversation/addMessage', {
      address,
      sender,
      message,
    })
  },
  /**
   * @description Sends a File message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * file: UploadDropItemType to be sent users bucket for textile
   */
  sendFileMessage: async ({ to, file }: WorkerActionPayload) => {
    textileActions.setLoading({ message: true })
    const path = `/${file.file.name}`
    textile.bucketManager?.getBucket()
    const result = await textile.bucketManager?.pushFile(
      file.file,
      path,
      (progress: number) => {
        postMessage({
          type: 'conversation/setUploadProgress',
          payload: { progress, name: file.file.name },
        })
      },
    )
    /* If already canceled */
    if (!state.textile.messageLoading) return
    const fileURL = `${Config.textile.browser}${result?.root}${path}`
    const friend = state.friends.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }
    const message = await textile.mailboxManager?.sendMessage<'file'>(
      friend.textilePubkey,
      {
        to: friend.textilePubkey,
        payload: {
          url: fileURL,
          name: file.file.name,
          size: file.file.size,
          type: file.file.type,
        },
        type: 'file',
      },
    )

    if (!message) {
      throw new Error(TextileError.SEND_FILE_FAILED)
    }

    textileActions.addMessageToConversation({
      address: friend.address,
      message,
      sender: MessageRouteEnum.OUTBOUND,
    })
    dbActions.storeConversationMessage({
      address: friend.address,
      message,
    })
    textileActions.setLoading({ message: false })
  },
  /**
   * @description Sends a reaction message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * the emoji and the id of the message the user reacted to
   */
  sendReactionMessage: async ({ to, reactTo, emoji }: WorkerActionPayload) => {
    if (!textile.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    const friend = state.friends.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }

    const message = await textile.mailboxManager.sendMessage<'reaction'>(
      friend.textilePubkey,
      {
        to: friend.textilePubkey,
        payload: emoji,
        reactedTo: reactTo,
        type: 'reaction',
      },
    )

    textileActions.addMessageToConversation({
      address: friend.address,
      message,
      sender: MessageRouteEnum.OUTBOUND,
    })
    dbActions.storeConversationMessage({
      address: friend.address,
      message,
    })
    textileActions.setLoading({ message: false })
  },
  /**
   * @description Sends a reply message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * the text message and the id of the message the user replied to
   */
  sendReplyMessage: async ({ to, replyTo, text, replyType }) => {
    if (!textile.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    const friend = state.friends.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }

    textileActions.setLoading({ message: true })
    dispatch('ui/setReplyChatbarContent', {
      id: '',
      payload: '',
      from: '',
    })

    const message = await textile.mailboxManager.sendMessage<'reply'>(
      friend.textilePubkey,
      {
        to: friend.textilePubkey,
        payload: text,
        repliedTo: replyTo,
        type: 'reply',
        replyType,
      },
    )

    textileActions.addMessageToConversation({
      address: friend.address,
      message,
      sender: MessageRouteEnum.OUTBOUND,
    })
    dbActions.storeConversationMessage({
      address: friend.address,
      message,
    })
    textileActions.setLoading({ message: false })
  },

  /**
   * @description Edit a text message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key)
   * and the text message to be sent
   */
  editTextMessage: async ({ to, original, text }) => {
    if (!textile.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    const friend = state.friends.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }

    const editingMessage = {
      ...original,
      payload: text,
      editingAt: Date.now(),
    } as Message
    await textileActions.addMessageToConversation({
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message: editingMessage,
    })

    const message = await textile.mailboxManager.editMessage<'text'>(
      original.id,
      {
        to: friend.textilePubkey,
        payload: text,
        type: 'text',
      },
    )

    if (message) {
      await textileActions.addMessageToConversation({
        address: friend.address,
        sender: MessageRouteEnum.OUTBOUND,
        message,
      })

      await dbActions.storeConversationMessage({
        address: friend.address,
        message,
      })
    } else {
      await textileActions.addMessageToConversation({
        address: friend.address,
        sender: MessageRouteEnum.OUTBOUND,
        message: original,
      })

      await dbActions.storeConversationMessage({
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
  sendGlyphMessage: async ({ to, src, pack }) => {
    if (!textile.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    const friend = state.friends.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }

    textileActions.setLoading({ message: true })

    const message = await textile.mailboxManager.sendMessage<'glyph'>(
      friend.textilePubkey,
      {
        to: friend.textilePubkey,
        payload: src,
        pack,
        type: 'glyph',
      },
    )

    await textileActions.addMessageToConversation({
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message,
    })

    await dbActions.storeConversationMessage({
      address: friend.address,
      message,
    })

    textileActions.setLoading({ message: false })
  },
  /**
   * @description Fetches messages that comes from a specific user
   * @param param0 Action Arguments
   * @param param1 An object containing the address of a friend where messages
   * you want to fetch comes from
   */
  fetchGroupMessages: async ({ groupId, setActive = true }) => {
    if (!textile.groupChatManager?.isInitialized()) {
      throw new Error(TextileError.EDIT_HOT_KEY_ERROR)
    }

    textileActions.setLoading({ conversation: true })

    const query = { limit: Config.chat.defaultMessageLimit, skip: 0 }
    const group = textileActions.getGroup(groupId)

    const conversation = await textile.groupChatManager.getConversation({
      group,
      query,
    })

    dispatch('conversation/setConversation', {
      address: groupId,
      messages: conversation,
      limit: query.limit,
      skip: query.skip,
      active: setActive,
    })

    textileActions.setLoading({ conversation: false })
  },
  /**
   * @description Subscribes to the user sentbox and eventually
   * appends sent messages to the active chat
   */
  subscribeToGroup: async ({ groupId }) => {
    if (!textile.mailboxManager) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_FOUND)
    }

    if (textile.mailboxManager.isSubscribed(MailboxSubscriptionType.sentbox)) {
      return
    }

    if (!textile.groupChatManager?.isInitialized()) {
      throw new Error(TextileError.EDIT_HOT_KEY_ERROR)
    }

    const group = textileActions.getGroup(groupId)

    await textile.groupChatManager.listenToGroupMessages((message) => {
      if (!message) {
        return
      }

      textileActions.addMessageToConversation({
        address: groupId,
        sender: MessageRouteEnum.INBOUND,
        message,
      })

      dbActions.storeConversationMessage({ address: groupId, message })
    }, group)
  },
  /**
   * @description Fetches messages that comes from a specific user
   * @param param0 Action Arguments
   * @param param1 An object containing the address of a friend where messages
   * you want to fetch comes from
   */
  sendGroupMessage: async ({ groupId, message }) => {
    try {
      if (!textile.groupChatManager?.isInitialized()) {
        throw new Error(TextileError.EDIT_HOT_KEY_ERROR)
      }

      textileActions.setLoading({ message: true })
      const group = textileActions.getGroup(groupId)

      const result = await textile.groupChatManager.sendMessage<'text'>(group, {
        to: group.id,
        payload: message,
        type: 'text',
      })

      if (!message) {
        throw new Error(TextileError.SEND_MESSAGE_FAILED)
      }
      textileActions.addMessageToConversation({
        address: groupId,
        sender: MessageRouteEnum.OUTBOUND,
        message: result,
      })

      await dbActions.storeConversationMessage({
        address: groupId,
        message: result,
      })
    } catch (e) {
      console.log(e)
    } finally {
      textileActions.setLoading({ message: false })
    }
  },
  /**
   * @description Sends a glyph message to a given group
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * glyph to be sent, and pack name
   */
  sendGroupGlyphMessage: async ({ groupID, src, pack }) => {
    if (!textile.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    textileActions.setLoading({ message: true })

    if (!textile.groupChatManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    const group = textileActions.getGroup(groupID)

    const result = await textile.groupChatManager.sendMessage<'glyph'>(group, {
      to: groupID,
      payload: src,
      pack,
      type: 'glyph',
    })

    textileActions.addMessageToConversation({
      address: groupID,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })

    dbActions.storeConversationMessage({ address: groupID, message: result })
    textileActions.setLoading({ message: false })
  },
  getGroup: ({ id }): Group => {
    const group = state.groups.find((it) => it.id === id)
    if (!group) throw new Error(AccountsError.CANNOT_FIND_GROUP)
    return group
  },
  /**
   * @description Sends a File message to a given group
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * file: UploadDropItemType to be sent users bucket for textile
   */
  sendGroupFileMessage: async ({ groupID, file }) => {
    const group = textileActions.getGroup(groupID)
    const path = `/${file.file.name}`
    textile.bucketManager?.getBucket()
    const result = await textile.bucketManager?.pushFile(
      file.file,
      path,
      (progress: number) => {
        postMessage({
          type: 'conversation/setUploadProgress',
          payload: {
            progress,
            name: file.file.name,
          },
        })
      },
    )
    const fileURL = `${Config.textile.browser}${result?.root}${path}`

    const sendFileResult = await textile.groupChatManager?.sendMessage<'file'>(
      group,
      {
        to: groupID,
        payload: {
          url: fileURL,
          name: file.file.name,
          size: file.file.size,
          type: file.file.type,
        },
        type: 'file',
      },
    )

    if (!sendFileResult) {
      throw new Error(TextileError.SEND_MESSAGE_FAILED)
    }

    await textileActions.addMessageToConversation({
      address: groupID,
      sender: MessageRouteEnum.OUTBOUND,
      message: sendFileResult,
    })

    await dbActions.storeConversationMessage({
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
  sendGroupReplyMessage: async ({ to, replyTo, text, replyType }) => {
    if (!textile.groupChatManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }
    if (!textile.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }

    textileActions.setLoading({ message: true })

    dispatch('ui/setReplyChatbarContent', {
      id: '',
      payload: '',
      from: '',
    })

    const group = textileActions.getGroup(to)
    const result = await textile.groupChatManager.sendMessage<'reply'>(group, {
      to,
      payload: text,
      repliedTo: replyTo,
      type: 'reply',
      replyType,
    })

    await textileActions.addMessageToConversation({
      address: to,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    await dbActions.storeConversationMessage({ address: to, message: result })
    textileActions.setLoading({ message: false })
  },
  /**
   * @description Sends a reaction message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * the emoji and the id of the message the user reacted to
   */
  sendGroupReactionMessage: async ({ to, reactTo, emoji }) => {
    if (!textile.groupChatManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }
    if (!textile.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_INITIALIZED)
    }
    const group = textileActions.getGroup(to)
    const result = await textile.groupChatManager.sendMessage<'reaction'>(
      group,
      {
        to,
        payload: emoji,
        reactedTo: reactTo,
        type: 'reaction',
      },
    )
    await textileActions.addMessageToConversation({
      address: to,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    await dbActions.storeConversationMessage({ address: to, message: result })
  },
  /**
   * @description Search for text within the specified conversations
   * @param param0 Action Arguments
   * @param param1 an object containing the query options, accounts, page, and limit,
   * a search result object is returned
   */
  searchConversations: async ({ query, page = 1, perPage = 10 }) => {
    const { queryString, dateRange, friends } = query
    const startDate =
      dateRange && new Date(dateRange.start).setHours(0, 0, 0, 0).valueOf()
    const endDate =
      dateRange && new Date(dateRange.end).setHours(23, 59, 59, 999).valueOf()

    // this rebuilds search indexes when changes are made to them with HMR
    if (!db.search.conversationMessages) {
      await db.initializeSearchIndexes()
    }

    const result = db.search.conversationMessages.search(
      `${queryString}${
        startDate && endDate
          ? ` AND at >= ${startDate} AND at <= ${endDate}`
          : ''
      }`,
      {
        fuzzy: 0.3,
      },
    )

    const skip = (page - 1) * perPage
    const list = result?.splice(skip, perPage).map((match) => ({
      ...match,
      user: friends.find(
        (friend: Friend) => friend.address === match.conversation,
      ),
    }))

    return {
      data: {
        totalRows: result?.length,
        list,
        perPage,
        page,
      },
    }
  },
}
