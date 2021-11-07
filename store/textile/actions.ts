import Vue from 'vue'
import { TextileState } from './types'
import { ActionsArguments } from '~/types/store/store'
import TextileManager from '~/libraries/Textile/TextileManager'
import { TextileConfig } from '~/types/textile/manager'
import { MailboxManager } from '~/libraries/Textile/MailboxManager'
import { Config } from '~/config'

export default {
  async initialize(
    { commit }: ActionsArguments<TextileState>,
    config: TextileConfig
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    await $TextileManager.init(config)

    const textilePublicKey = $TextileManager.getIdentityPublicKey()

    commit('textileInitialized', true)
    commit('accounts/updateMailboxId', textilePublicKey, { root: true })
  },
  async fetchMessages(
    { commit, rootState, dispatch, state }: ActionsArguments<TextileState>,
    { address }: { address: string }
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error('Mailbox manager not initialized')
    }

    const friend = rootState.friends.all.find((fr) => fr.publicKey === address)

    if (!friend) {
      throw new Error('Friend not found')
    }

    commit('setConversationLoading', { loading: true })

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

    const query = { limit: Config.chat.defaultMessageLimit, skip: 0 }

    const conversation = await $MailboxManager.getConversation(
      friend.mailboxId,
      query
    )

    commit('setConversation', {
      address: friend.publicKey,
      messages: conversation,
      limit: query.limit,
      skip: query.skip,
    })

    commit('setConversationLoading', { loading: false })
  },
  async loadMoreMessages(
    { commit, rootState, dispatch, state }: ActionsArguments<TextileState>,
    { address }: { address: string }
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error('Mailbox manager not initialized')
    }

    const friend = rootState.friends.all.find((fr) => fr.publicKey === address)

    if (!friend) {
      throw new Error('Friend not found')
    }

    const currentConversation = state.conversations[address]

    console.log('currentConversation', currentConversation)

    // commit('setConversationLoading', { loading: true })

    // const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

    // const query = { limit: Config.chat.defaultMessageLimit, skip: 0 }

    // const conversation = await $MailboxManager.getConversation(
    //   friend.mailboxId,
    //   query
    // )

    // commit('setConversation', {
    //   address: friend.publicKey,
    //   messages: conversation,
    //   limit: query.limit,
    //   skip: query.skip,
    // })

    // commit('setConversationLoading', { loading: false })
  },
  async sendTextMessage(
    { commit, rootState }: ActionsArguments<TextileState>,
    { to, text }: { to: string; text: string }
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error('Mailbox manager not initialized')
    }

    const friend = rootState.friends.all.find((fr) => fr.publicKey === to)

    if (!friend) {
      throw new Error('Friend not found')
    }

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

    const result = await $MailboxManager.sendMessage<'text'>(friend.mailboxId, {
      to: friend.mailboxId,
      payload: text,
      type: 'text',
    })

    commit('addMessageToConversation', {
      address: to,
      message: result,
    })
  },
  async sendReactionMessage(
    { commit, rootState }: ActionsArguments<TextileState>,
    { to, reactTo, emoji }: { to: string; reactTo: string; emoji: string }
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error('Mailbox manager not initialized')
    }

    const friend = rootState.friends.all.find((fr) => fr.mailboxId === to)

    if (!friend) {
      throw new Error('Friend not found')
    }

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

    const result = await $MailboxManager.sendMessage<'reaction'>(
      friend.mailboxId,
      {
        to: friend.mailboxId,
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
  async sendReplyMessage(
    { commit, rootState }: ActionsArguments<TextileState>,
    { to, replyTo, text }: { to: string; replyTo: string; text: string }
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error('Mailbox manager not initialized')
    }

    const friend = rootState.friends.all.find((fr) => fr.address === to)

    if (!friend) {
      throw new Error('Friend not found')
    }

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

    const result = await $MailboxManager.sendMessage<'reply'>(
      friend.mailboxId,
      {
        to: friend.mailboxId,
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
