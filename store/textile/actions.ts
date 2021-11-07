import Vue from 'vue'
import { TextileState } from './types'
import { ActionsArguments } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import { TextileConfig } from '~/types/textile/manager'
import { MailboxManager } from '~/libraries/Textile/MailboxManager'
import { Config } from '~/config'
import { MailboxSubscriptionType } from '~/types/textile/mailbox'

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
    config: TextileConfig
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    await $TextileManager.init(config)

    const textilePublicKey = $TextileManager.getIdentityPublicKey()

    commit('textileInitialized', true)
    commit('accounts/updateTextilePubkey', textilePublicKey, { root: true })
  },
  /**
   * @description Fetches messages that comes from a specific user
   * @param param0 Action Arguments
   * @param param1 An object containing the address of a friend where messages
   * you want to fetch comes from
   */
  async fetchMessages(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { address }: { address: string }
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
      query
    )

    commit('setConversation', {
      address: friend.address,
      messages: conversation,
      limit: query.limit,
      skip: query.skip,
    })

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
        (friend) => friend.textilePubkey === message.from
      )

      if (!sender) {
        return
      }

      commit('addMessageToConversation', {
        address: sender.address,
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
      console.log('sentbox', message)
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
    { to, text }: { to: string; text: string }
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

    const result = await $MailboxManager.sendMessage<'text'>(
      friend.textilePubkey,
      {
        to: friend.textilePubkey,
        payload: text,
        type: 'text',
      }
    )

    commit('addMessageToConversation', {
      address: friend.address,
      message: result,
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
    { to, reactTo, emoji }: { to: string; reactTo: string; emoji: string }
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
      }
    )

    commit('addMessageToConversation', {
      address: friend.address,
      message: result,
    })
  },
  /**
   * @description Sends a reply message to a given friend
   * @param param0 Action Arguments
   * @param param1 an object containing the recipient address (textile public key),
   * the text message and the id of the message the user replied to
   */
  async sendReplyMessage(
    { commit, rootState }: ActionsArguments<TextileState>,
    { to, replyTo, text }: { to: string; replyTo: string; text: string }
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
      }
    )

    commit('addMessageToConversation', {
      address: friend.address,
      message: result,
    })
  },
}
