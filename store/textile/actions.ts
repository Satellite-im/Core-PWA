import Vue from 'vue'
import { TextileState } from './types'
import { ActionsArguments } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import { TextileConfig } from '~/types/textile/manager'
import { MailboxManager } from '~/libraries/Textile/MailboxManager'
import { MessageRouteEnum } from '~/libraries/Enums/enums'
import { Config } from '~/config'
import { MailboxSubscriptionType, Message } from '~/types/textile/mailbox'
import { UploadDropItemType } from "~/types/files/file";
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

    // Set Textile Ready prerequisite as true
    commit('prerequisites/setTextileReady', true, { root: true })
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
      throw new Error('Mailbox manager not initialized')
    }

    const friend = rootState.friends.all.find((fr) => fr.address === address)

    if (!friend) {
      throw new Error('Friend not found')
    }

    commit('setConversationLoading', { loading: true })

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

    const query = { limit: Config.chat.defaultMessageLimit, skip: 0 }

    const conversation = await $MailboxManager.getConversation(
      friend.textilePubkey,
      query,
    )

    commit('setConversation', {
      address: friend.address,
      messages: conversation,
      limit: query.limit,
      skip: query.skip,
    })

    commit('friends/setActive', friend, { root: true })

    commit('setConversationLoading', { loading: false })

    // TODO: only for testing
    dispatch('subscribeToMailbox')
  },
  /**
   * @description Needed for loading more messages from a specific friend
   * @param param0
   * @param param1
   */
  // async loadMoreMessages(
  //   { commit, rootState, dispatch, state }: ActionsArguments<TextileState>,
  //   { address }: { address: string }
  // ) {
  //   const $TextileManager: TextileManager = Vue.prototype.$TextileManager

  //   if (!$TextileManager.mailboxManager?.isInitialized()) {
  //     throw new Error('Mailbox manager not initialized')
  //   }

  //   const friend = rootState.friends.all.find((fr) => fr.address === address)

  //   if (!friend) {
  //     throw new Error('Friend not found')
  //   }

  //   const currentConversation = state.conversations[address]

  //   commit('setConversationLoading', { loading: true })

  //   const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

  //   const query = { limit: Config.chat.defaultMessageLimit, skip: 0 }

  //   const conversation = await $MailboxManager.getConversation(
  //     friend.textilePubkey,
  //     query
  //   )

  //   commit('setConversation', {
  //     address: friend.publicKey,
  //     messages: conversation,
  //     limit: query.limit,
  //     skip: query.skip,
  //   })

  //   commit('setConversationLoading', { loading: false })
  // },
  /**
   * @description Subscribes to the user mailbox, if not already subscribed, and eventually
   * updates messages in the active chat
   * @param param0 Action Arguments
   */
  async subscribeToMailbox({
    commit,
    rootState,
  }: ActionsArguments<TextileState>) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    const MailboxManager = $TextileManager.mailboxManager

    if (!MailboxManager) {
      throw new Error('Mailbox manager not found')
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
      throw new Error('Mailbox manager not found')
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
    { commit, rootState }: ActionsArguments<TextileState>,
    { to, text }: { to: string; text: string },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error('Mailbox manager not initialized')
    }

    const friend = rootState.friends.all.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error('Friend not found')
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
    commit('setMessageLoading', { loading: false })
  }
  /**
   * @description Sends a File message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * file: UploadDropItemType to be sent users bucket for textile
   */,
  async sendFileMessage(
    { commit, rootState }: ActionsArguments<TextileState>,
    { to, file }: { to: string; file: UploadDropItemType },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager
    const path = `/${file.file.name}`
    $TextileManager.bucketManager?.getBucket()
    const result = await $TextileManager.bucketManager?.pushFile(
      file.file,
      path,
      (progress: number) => {
        commit('setUploadingFileProgress', progress)
      },
    )
    const imageURL = `${Config.textile.browser}${result?.root}${path}`
    $TextileManager.bucketManager?.addToIndex(file.file, result?.root, path)
    const friend = rootState.friends.all.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error('Friend not found')
    }

    const sendMessageResult =
      await $TextileManager.mailboxManager?.sendMessage<'file'>(
        friend.textilePubkey,
        {
          to: friend.textilePubkey,
          payload: {
            url: imageURL,
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
      message: sendMessageResult,
    })
  },
  /**
   * @description Sends a reaction message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * the emoji and the id of the message the user reacted to
   */
  async sendReactionMessage(
    { commit, rootState }: ActionsArguments<TextileState>,
    { to, reactTo, emoji }: { to: string; reactTo: string; emoji: string },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error('Mailbox manager not initialized')
    }

    const friend = rootState.friends.all.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error('Friend not found')
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
  },
  // async updateFileProgress(
  //   { commit }: ActionsArguments<TextileState>, {uploaded, fileSize}: {uploaded: number, fileSize: number}){
  //   commit( 'setUploadingFileProgress' ,uploaded / fileSize * 100)
  // },
  /**
   * @description Sends a reply message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * the text message and the id of the message the user replied to
   */
  async sendReplyMessage(
    { commit, rootState }: ActionsArguments<TextileState>,
    { to, replyTo, text }: { to: string; replyTo: string; text: string },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error('Mailbox manager not initialized')
    }

    const friend = rootState.friends.all.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error('Friend not found')
    }

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager
    const result = await $MailboxManager.sendMessage<'reply'>(
      friend.textilePubkey,
      {
        to: friend.textilePubkey,
        payload: text,
        repliedTo: replyTo,
        type: 'reply',
      },
    )

    commit('addMessageToConversation', {
      address: friend.address,
      sender: MessageRouteEnum.OUTBOUND,
      message: result,
    })
    commit(
      'ui/setReplyChatbarContent',
      {
        id: '',
        payload: '',
        from: '',
      },
      { root: true },
    )
  },

  /**
   * @description Sends a text message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key)
   * and the text message to be sent
   */
  async editTextMessage(
    { commit, rootState }: ActionsArguments<TextileState>,
    { to, original, text }: { to: string; text: string, original: Message },
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error('Mailbox manager not initialized')
    }

    const friend = rootState.friends.all.find((fr) => fr.textilePubkey === to)

    if (!friend) {
      throw new Error('Friend not found')
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

    const result = await $MailboxManager.editMessage<'text'>(
      original.id,
      {
        to: friend.textilePubkey,
        payload: text,
        type: 'text',
      },
    )

    if (result) {
      commit('addMessageToConversation', {
        address: friend.address,
        sender: MessageRouteEnum.OUTBOUND,
        message: result,
      })
    } else {
      commit('addMessageToConversation', {
        address: friend.address,
        sender: MessageRouteEnum.OUTBOUND,
        message: original,
      })
    }
  },
}
