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

    const mailboxId = await $TextileManager.init(config)

    commit('textileInitialized', true)
    commit('accounts/updateMailboxId', mailboxId, { root: true })
  },
  async fetchMessages(
    { commit, rootState, dispatch }: ActionsArguments<TextileState>,
    { address }: { address: string }
  ) {
    const $TextileManager: TextileManager = Vue.prototype.$TextileManager

    // dispatch('sendText', { to: address, text: 'prova' })

    if (!$TextileManager.mailboxManager?.isInitialized()) {
      throw new Error('Mailbox manager not initialized')
    }

    const friend = rootState.friends.all.find((fr) => fr.publicKey === address)

    if (!friend) {
      throw new Error('Friend not found')
    }

    commit('setConversationLoading', { loading: true })

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

    const limit = { limit: Config.chat.defaultMessageLimit, skip: 0 }

    const conversation = await $MailboxManager.getConversation(
      friend.mailboxId,
      limit
    )

    commit('setConversation', {
      address: friend.publicKey,
      messages: conversation,
    })

    commit('setConversationLoading', { loading: false })
  },
  async sendText(
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

    // commit('setConversationLoading', { loading: true })

    const $MailboxManager: MailboxManager = $TextileManager.mailboxManager

    await $MailboxManager.sendMessage<'text'>(friend.mailboxId, {
      to: friend.mailboxId,
      payload: text,
      type: 'text',
    })

    // const limit = { limit: Config.chat.defaultMessageLimit, skip: 0 }

    // const conversation = await $MailboxManager.getConversation(
    //   friend.mailboxId,
    //   limit
    // )

    // commit('setConversation', {
    //   address: friend.publicKey,
    //   messages: conversation,
    // })

    // commit('setConversationLoading', { loading: false })
  },
}
