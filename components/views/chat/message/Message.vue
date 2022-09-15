<template src="./Message.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { ArchiveIcon } from 'satellite-lucide-icons'
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

export default Vue.extend({
  components: {
    ArchiveIcon,
  },
  props: {
    message: {
      type: Object as PropType<ConversationMessage>,
      required: true,
    },
    replies: {
      type: Array as PropType<ConversationMessage[]>,
      default: [] as ConversationMessage[],
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
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      chat: (state) => (state as RootState).chat,
    }),
    ...mapGetters({
      getTimestamp: 'settings/getTimestamp',
    }),
    conversationId(): Conversation['id'] {
      return this.$route.params.id
    },
    author(): User | undefined {
      return this.message.from === iridium.id
        ? (iridium.profile.state as User)
        : iridium.users.state[this.message.from]
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
      return this.getTimestamp({ time: this.message.at })
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
          // { text: this.$t('context.edit'), func: this.editMessage },
          // skipped due to edit message is now coming soon and this shouldn't appear on context menu
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
            // { text: this.$t('context.edit'), func: this.editMessage },
            // skipped due to edit message is now coming soon and this shouldn't appear on context menu
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
  },
  methods: {
    /**
     * @method showQuickProfile
     * @description Shows quickprofile component for user by setting quickProfile to true in state and setQuickProfilePosition
     * to the current group components click event data
     * @param e Event object from group component click
     * @example v-on:click="showQuickProfile"
     */
    showQuickProfile(e: MouseEvent) {
      const openQuickProfile = () => {
        this.$store.dispatch('ui/showQuickProfile', {
          did: this.message.from,
          position: { x: e.x, y: e.y },
        })
      }
      if (!this.ui.quickProfile) {
        openQuickProfile()
        return
      }
      setTimeout(() => {
        if (!this.ui.quickProfile) {
          openQuickProfile()
        }
      }, 0)
    },
    /**
     * @method copyMessage
     * @description copy contents of message. Will only be called if text message
     */
    copyMessage() {
      if (!this.message.body) {
        return
      }
      navigator.clipboard.writeText(this.message.body)
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
      this.$store.commit('ui/settingReaction', {
        status: true,
        conversationId: this.message.conversationId,
        messageId: this.message.id,
      })
      this.$store.commit('ui/toggleEnhancers', {
        show: !this.ui.enhancers.show,
        floating: true,
      })
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
  },
})
</script>
<style lang="less" src="./Message.less"></style>
