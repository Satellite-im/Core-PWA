import Vue from 'vue'
import { TextileState, TextileError } from './types'
import { ActionsArguments } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import { TextileConfig } from '~/types/textile/manager'
import { MailboxManager } from '~/libraries/Textile/MailboxManager'
import { MessageRouteEnum, PropCommonEnum } from '~/libraries/Enums/enums'
import { Config } from '~/config'
import { MailboxSubscriptionType, Message } from '~/types/textile/mailbox'
import { UploadDropItemType } from '~/types/files/file'
import { db, DexieMessage } from '~/plugins/thirdparty/dexie'
import { GroupChatManager } from '~/libraries/Textile/GroupChatManager'
import { FilSystem } from '~/libraries/Files/FilSystem'

export default {
  /**
   * @description Initializes the TextileManager class and retrieves the
   * Textile public key that must be shared to friends in order to receive
   * messages
   * @param param0 Action Arguments
   * @param config Textile configuration (id, pass, wallet)
   */
  async initialize(
    { commit }: ActionsArguments<TextileState>,
    config: TextileConfig,
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    await $TextileManager.init(config)

    const textilePublicKey = $TextileManager.getIdentityPublicKey()

    commit('textileInitialized', true)
    commit('accounts/updateTextilePubkey', textilePublicKey, { root: true })

    const fsExport = $TextileManager.bucket?.index

    if (fsExport) {
      const $FileSystem: FilSystem = Vue.prototype.$FileSystem
      $FileSystem.import(fsExport)
    }
  },
  /**
   * @description Fetches messages that comes from a specific user
   * @param param0 Action Arguments
   * @param param1 An object containing the address of a friend where messages
   * you want to fetch comes from
   */
  async fetchMessages(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { address }: { address: string },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error(TextileError.EDIT_HOT_KEY_ERROR)
    }

    const friend = rootState.friends.all.find((fr) => fr.address === address)

    if (!friend) {
      throw new Error(TextileError.FRIEND_NOT_FOUND)
    }

    commit('setConversationLoading', { loading: true })

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

    const query = { limit: Config.chat.defaultMessageLimit, skip: 0 }

    let conversation: Message[] = []

    const dbMessages = await db.conversations.get(address).then((convo) => {
      return convo?.conversation ?? []
    })

    const lastInbound =
      rootState.textile.conversations[address]?.lastInbound ?? 0

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

    // store latest data in indexeddb
    const dbData: DexieMessage = {
      conversation,
      key: address,
      lastInbound,
    }
    db.conversations.put(dbData)

    commit('setConversation', {
      address: friend.address,
      messages: conversation,
      limit: query.limit,
      skip: query.skip,
    })

    commit('friends/setActive', friend, { root: true })

    commit('setConversationLoading', { loading: false })
    commit('setMessageLoading', { loading: false })

    // TODO: only for testing
    dispatch('subscribeToMailbox')
  },
  /**
   * @description Subscribes to the user mailbox, if not already subscribed, and eventually
   * updates messages in the active chat
   * @param param0 Action Arguments
   */
  async subscribeToMailbox({
    commit,
    rootState,
    dispatch,
  }: ActionsArguments<TextileState>) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    const MailboxManager = $TextileManager.mailboxManager

    if (!MailboxManager) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_FOUND)
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

      commit('addMessageToConversation', {
        address: sender.address,
        sender: MessageRouteEnum.INBOUND,
        message,
      })

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

    commit('addMessageToConversation', {
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    dispatch('storeMessage', { address: friend.address, message: result })
    commit('setMessageLoading', { loading: false })
  },
  clearUploadStatus({ commit }: ActionsArguments<TextileState>) {
    commit('clearUploadProgress', {})
  },
  /**
   * @description Sends a File message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * file: UploadDropItemType to be sent users bucket for textile
   */
  async sendFileMessage(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { to, file }: { to: string; file: UploadDropItemType },
  ) {
    commit('setMessageLoading', { loading: true })
    document.body.style.cursor = PropCommonEnum.WAIT
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    const path = `/${file.file.name}`
    $TextileManager.bucketManager?.getBucket()
    const result = await $TextileManager.bucketManager?.pushFile(
      file.file,
      path,
      (progress: number) => {
        commit('setUploadingFileProgress', {
          progress,
          name: file.file.name,
        })
      },
    )
    /* If already canceled */
    if (!rootState.textile.messageLoading) return
    const fileURL = `${Config.textile.browser}${result?.root}${path}`
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
            url: fileURL,
            name: file.file.name,
            size: file.file.size,
            type: file.file.type,
          },
          type: 'file',
        },
      )

    commit('addMessageToConversation', {
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message: sendFileResult,
    })
    dispatch('storeMessage', {
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
    commit('addMessageToConversation', {
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    dispatch('storeMessage', { address: friend.address, message: result })
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

    commit('addMessageToConversation', {
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    dispatch('storeMessage', { address: friend.address, message: result })
    commit('setMessageLoading', { loading: false })
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

    commit('addMessageToConversation', {
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
      commit('addMessageToConversation', {
        address: friend.address,
        sender: MessageRouteEnum.OUTBOUND,
        message: result,
      })
      dispatch('storeMessage', { address: friend.address, message: result })
    } else {
      commit('addMessageToConversation', {
        address: friend.address,
        sender: MessageRouteEnum.OUTBOUND,
        message: original,
      })
      dispatch('storeMessage', { address: friend.address, message: original })
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

    commit('addMessageToConversation', {
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    dispatch('storeMessage', { address: friend.address, message: result })

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
    // replace old message with new edited version
    if (message.editedAt) {
      db.conversations.get(address).then((convo) => {
        if (!convo) {
          return
        }
        const index = convo.conversation.map((e) => e.id).indexOf(message.id)
        convo.conversation[index] = message
        db.conversations.put(convo)
      })
      return
    }

    // add regular message to indexeddb
    db.conversations
      .where('key')
      .equals(address)
      .modify((convo) => convo.conversation.push(message))
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
    // replace old message with new edited version
    if (message.editedAt) {
      db.conversations.get(address).then((convo) => {
        if (!convo) {
          return
        }
        const index = convo.conversation.map((e) => e.id).indexOf(message.id)
        convo.conversation[index] = message
        db.conversations.put(convo)
      })
      return
    }

    // add regular message to indexeddb
    db.conversations
      .where('key')
      .equals(address)
      .modify((convo) => {
        convo.conversation.push(message)
        convo.lastInbound = message.at
      })
  },
  /**
   * @description Fetches messages that comes from a specific user
   * @param param0 Action Arguments
   * @param param1 An object containing the address of a friend where messages
   * you want to fetch comes from
   */
  async fetchGroupMessages(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { groupId }: { groupId: string },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.groupChatManager?.isInitialized()) {
      throw new Error(TextileError.EDIT_HOT_KEY_ERROR)
    }

    commit('setConversationLoading', { loading: true })

    const $GroupChatManager: GroupChatManager = $TextileManager.groupChatManager

    const query = { limit: Config.chat.defaultMessageLimit, skip: 0 }

    const conversation = await $GroupChatManager.getConversation({
      groupChatID: groupId,
      query,
    })

    commit('setConversation', {
      address: groupId,
      messages: conversation,
      limit: query.limit,
      skip: query.skip,
    })

    commit('setConversationLoading', { loading: false })
  },
  /**
   * @description Subscribes to the user sentbox and eventually
   * appends sent messages to the active chat
   */
  async subscribeToGroup(
    { commit, dispatch }: ActionsArguments<TextileState>,
    { groupId }: { groupId: string },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    const MailboxManager = $TextileManager.mailboxManager

    if (!MailboxManager) {
      throw new Error(TextileError.MAILBOX_MANAGER_NOT_FOUND)
    }

    if (MailboxManager.isSubscribed(MailboxSubscriptionType.sentbox)) {
      return
    }

    if (!$TextileManager.groupChatManager?.isInitialized()) {
      throw new Error(TextileError.EDIT_HOT_KEY_ERROR)
    }

    const $GroupChatManager: GroupChatManager = $TextileManager.groupChatManager

    await $GroupChatManager.listenToGroupMessages((message) => {
      if (!message) {
        return
      }

      commit('addMessageToConversation', {
        address: groupId,
        sender: MessageRouteEnum.INBOUND,
        message,
      })

      dispatch('storeInMessage', { address: groupId, message })
    }, groupId)
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
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.groupChatManager?.isInitialized()) {
      throw new Error(TextileError.EDIT_HOT_KEY_ERROR)
    }
    const $GroupChatManager: GroupChatManager = $TextileManager.groupChatManager

    commit('setMessageLoading', { loading: true })

    const result = await $GroupChatManager
      .sendMessage<'text'>({ to: groupId, payload: message, type: 'text' })
      .catch((e) => console.log('error', e))

    commit('addMessageToConversation', {
      address: groupId,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })

    dispatch('storeInMessage', { address: groupId, message })

    commit('setMessageLoading', { loading: false })
  },
}
