<template src="./Message.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { toHTML } from '~/libraries/ui/Markdown'
import { ContextMenuItem, EmojiUsage } from '~/store/ui/types'
import { RootState } from '~/types/store/store'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'
import { User } from '~/libraries/Iridium/users/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import { conversationMessageIsNotice } from '~/utilities/chat'
import { onlyHasEmoji } from '~/utilities/onlyHasEmoji'
import { capacitorHooks } from '~/components/compositions/capacitor'
import { getTimestamp } from '~/utilities/timestamp'

export default Vue.extend({
  props: {
    message: {
      type: Object as PropType<ConversationMessage>,
      required: true,
    },
    replies: {
      type: Array as PropType<Array<ConversationMessage>>,
      required: false,
      default: () => [],
    },
    isScrolling: {
      type: Boolean,
      default: false,
    },
    isFirstUnreadMessage: {
      type: Boolean,
      default: false,
    },
    isLastCallMessage: {
      type: Boolean,
      default: false,
    },
    showHeader: {
      type: Boolean,
      default: false,
    },
    hideReplyAction: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { copyText } = capacitorHooks()

    return {
      copyText,
    }
  },
  data: () => ({
    users: iridium.users,
    intersectionObserver: null as IntersectionObserver | null,
  }),
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      chat: (state) => (state as RootState).chat,
    }),
    conversationId(): Conversation['id'] {
      return this.$route.params.id
    },
    author(): User | undefined {
      return this.users.getUser(this.message.from)
    },
    avatarSrc(): string | undefined {
      return (
        this.author?.photoHash &&
        this.$Config.ipfs.gateway + this.author.photoHash
      )
    },
    isReplyingTo(): boolean {
      return (
        this.chat.replyChatbarMessages[this.conversationId]?.id ===
        this.message.id
      )
    },
    timestamp(): string {
      return getTimestamp(this.message.at)
    },
    isNotice(): boolean {
      return conversationMessageIsNotice(this.message)
    },
    isEditing(): boolean {
      return this.ui.editMessage.id === this.message.id
    },
    containsOnlyEmoji(): boolean {
      return onlyHasEmoji(this.message?.body ?? '')
    },
    markdownToHtml(): string {
      const html = toHTML(this.message?.body ?? '', { liveTyping: false })
      return html.replace(
        this.$Config.regex.emojiWrapper,
        (emoji) => `<span class="emoji">${emoji}</span>`,
      )
    },
    contextMenuValues(): ContextMenuItem[] {
      const mainList = [
        { text: 'quickReaction', func: this.quickReaction },
        { text: this.$t('context.reaction'), func: this.emojiReaction },
        // AP-1120 copy link functionality
        // { text: this.$t('context.copy_link'), func: (this as any).testFunc },
      ]

      if (this.message.replyToId) {
        return [
          ...mainList,
          { text: this.$t('context.copy_msg'), func: this.copyMessage },
        ]
      }

      mainList.push({
        text: this.$t('context.reply'),
        func: this.setReplyChatbarMessage,
      })

      if (this.message.type === 'text') {
        // if your own text message
        if (iridium.profile.state?.did === this.message.from) {
          return [
            ...mainList,
            { text: this.$t('context.copy_msg'), func: this.copyMessage },
            { text: this.$t('context.edit'), func: this.editMessage },
          ]
        }
        // another persons text message
        return [
          ...mainList,
          { text: this.$t('context.copy_msg'), func: this.copyMessage },
        ]
      }
      return mainList
    },
    actionsEnabled(): boolean {
      return this.message.type !== 'call' && !this.message.status
    },
  },
  mounted() {
    const conversationEl = document.querySelector(
      '.conversation-wrapper',
    ) as HTMLElement
    const messageEl = this.$refs.container as HTMLElement
    this.intersectionObserver = new IntersectionObserver(
      () => {
        if (this.isFirstUnreadMessage) {
          const messageBox = messageEl.getBoundingClientRect()
          const conversationBox = conversationEl.getBoundingClientRect()
          this.$emit('unreadMessage', {
            message: this.message,
            messageEl,
            isAboveViewport: messageBox.bottom < conversationBox.top,
            isBelowViewport: messageBox.top > conversationBox.bottom,
          })
        }
      },
      {
        root: conversationEl,
        threshold: 0,
      },
    )
    this.intersectionObserver.observe(messageEl)

    if (!this.$refs['message-row']) return
    Array.from(
      (this.$refs['message-row'] as HTMLElement).getElementsByClassName(
        'spoiler-container',
      ),
    ).forEach((spoiler) => {
      spoiler.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        spoiler.classList.add('spoiler-open')
      })
    })
  },
  beforeDestroy() {
    this.intersectionObserver?.disconnect()
  },
  methods: {
    /**
     * @method showQuickProfile
     * @param e Event object from group component click
     * @example v-on:click="showQuickProfile"
     */
    showQuickProfile(e: MouseEvent) {
      this.$store.commit('ui/setQuickProfile', {
        user: this.author,
        position: { x: e.x, y: e.y },
      })
    },
    /**
     * @method copyMessage
     * @description copy contents of message. Will only be called if text message
     */
    copyMessage() {
      if (!this.message.body) {
        return
      }
      this.copyText(this.message.body)
    },
    setReplyChatbarMessage() {
      this.$store.commit('chat/setReplyChatbarMessage', {
        conversationId: this.message.conversationId,
        message: this.message,
      })
      this.$nextTick(() => this.$store.dispatch('ui/setChatbarFocus'))
    },
    /**
     * @method emojiReaction DocsTODO
     * @description
     * @example
     */
    emojiReaction() {
      this.$store.commit('chat/setMessageReaction', {
        conversationId: this.message.conversationId,
        messageId: this.message.id,
      })
      this.$store.commit('chat/setEnhancersRoute', 'emoji')
    },
    quickReaction(emoji: EmojiUsage) {
      iridium.chat.toggleMessageReaction({
        conversationId: this.message.conversationId,
        messageId: this.message.id,
        reaction: emoji.content,
      })
    },
    editMessage() {
      const { id, payload, from } = this.message
      this.$store.commit('ui/setEditMessage', {
        id,
        payload,
        from,
      })
    },
    async saveMessage(message: string) {
      this.$store.commit('ui/setEditMessage', {
        id: '',
        payload: '',
        from: '',
      })

      if (message !== this.message.body) {
        await iridium.chat.editMessage({
          conversationId: this.message.conversationId,
          messageId: this.message.id,
          body: message,
        })
      }

      if (this.$device.isDesktop) {
        this.$store.dispatch('ui/setChatbarFocus')
      }
    },
    cancelMessage() {
      this.$store.commit('ui/setEditMessage', {
        id: '',
        payload: '',
        from: '',
      })
      if (this.$device.isDesktop) {
        this.$store.dispatch('ui/setChatbarFocus')
      }
    },
  },
})
</script>
<style lang="less" src="./Message.less"></style>
