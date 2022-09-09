<template src="./Item.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { TranslateResult } from 'vue-i18n'
import VueMarkdown from 'vue-markdown'
import { mapGetters } from 'vuex'
import { toHTML } from '~/libraries/ui/Markdown'
import { ContextMenuItem } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'
import { User, UserStatus } from '~/libraries/Iridium/users/types'

export default Vue.extend({
  components: {
    VueMarkdown,
  },
  props: {
    conversationId: {
      type: String as PropType<Conversation['id']>,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      timestamp: '' as string | TranslateResult,
      timeoutId: undefined as NodeJS.Timeout | undefined,
      conversations: iridium.chat.state.conversations,
      statuses: iridium.users.ephemeral.status,
      users: iridium.users.state,
    }
  },
  computed: {
    ...mapGetters('settings', ['getTimestamp', 'getDate']),
    conversation(): Conversation {
      return iridium.chat.state.conversations[this.conversationId]
    },
    hasUnreadMessages(): boolean {
      if (!this.conversation.lastReadAt) return true
      const messages = Object.keys(this.conversation.message)
      const lastMessage =
        this.conversation.message[messages[messages.length - 1]]
      return this.conversation.lastReadAt < (lastMessage?.at || 0)
    },
    userId(): string {
      const userId =
        (this.conversation.participants || []).find(
          (participant) => participant !== iridium.id,
        ) || ''

      return userId
    },
    user(): User {
      return iridium.users.state[this.userId]
    },
    status(): UserStatus {
      return iridium.users.ephemeral.status?.[this.userId] || 'offline'
    },
    isTyping(): boolean {
      if (!this.user) return false

      return (
        !!this.conversation &&
        (iridium.chat.ephemeral.typing[this.conversation.id] || []).includes(
          this.user.did,
        )
      )
    },
    contextMenuValues(): ContextMenuItem[] {
      return this.conversation?.type === 'direct'
        ? [
            {
              text: this.$t('context.voice'),
              func: this.status === 'online' ? this.call : () => {},
              type: this.status === 'online' ? 'primary' : 'disabled',
            },
            // {
            //   text: this.$t('context.profile'),
            //   func: () => this.$store.dispatch('ui/showProfile', this.user),
            // },
            {
              text: this.$t('context.remove'),
              func: this.removeFriend,
              type: 'danger',
            },
          ]
        : [
            {
              text: this.$t('context.voice'),
              func: () => {},
              type: 'disabled',
            },

            {
              text: this.$t('context.leave_group'),
              func: this.leaveGroup,
              type: 'danger',
            },
          ]
    },
    messages(): ConversationMessage[] {
      return Object.values(
        iridium.chat.state.conversations[this.conversationId].message,
      ).sort((a, b) => a.at - b.at)
    },
    lastMessageDisplay(): string {
      const message = this.messages.at(-1)
      if (!message) {
        return this.$t('messaging.say_hi') as string
      }

      const name = iridium.users.getUser(message.from)?.name
      const members = message.members
        ?.map((did) => iridium.users.getUser(did)?.name)
        .filter((name) => name)
        .join(', ')

      const fromSelf = message.from === iridium.id

      if (message.attachments.length) {
        return fromSelf
          ? (this.$t('messaging.you_sent_attachment') as string)
          : (this.$t('messaging.sent_attachment', { name }) as string)
      }

      switch (message.type) {
        case 'glyph':
          return fromSelf
            ? (this.$t('messaging.you_sent_glyph') as string)
            : (this.$t('messaging.sent_glyph', { name }) as string)
        case 'member_join':
          return this.$t('messaging.group_join', {
            name,
            members,
          }) as string
        case 'member_leave':
          return this.$t('messaging.group_leave', { name }) as string
      }

      return message.body || ''
    },
    isSelected(): boolean {
      return this.conversation?.id === this.$route.params.id
    },
  },
  watch: {
    messages: {
      handler() {
        this.setTimestamp()
      },
      deep: true,
    },
  },
  mounted() {
    // Array.from(
    //   (this.$refs.subtitle as HTMLElement).getElementsByClassName(
    //     'spoiler-container',
    //   ),
    // ).forEach((spoiler) => {
    //   spoiler.addEventListener('click', (e) => {
    //     e.preventDefault()
    //     e.stopPropagation()
    //     spoiler.classList.add('spoiler-open')
    //   })
    // })
    this.setTimestamp()
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
    this.$store.commit('ui/toggleContextMenu', false)
  },
  methods: {
    async removeFriend() {
      if (!this.user?.did) {
        return
      }
      this.isLoading = true
      await iridium.friends
        .friendRemove(this.user.did)
        .catch((e) => this.$toast.error(this.$t(e.message) as string))
      this.isLoading = false
    },
    async leaveGroup() {
      if (!this.conversation?.id) {
        return
      }
      iridium.chat.leaveGroup(this.conversation.id)
    },
    /**
     * @method openConversation
     * @description Navigates to user or group conversation
     */
    async openConversation() {
      if (!this.conversation?.id) {
        return
      }
      if (this.$device.isMobile) {
        if (this.conversation.id === this.$route.params.id) {
          this.$emit('slideNext')
          return
        }
        this.$router.push({ params: { id: this.conversation.id } })
        return
      }
      this.$router.push(`/chat/${this.conversation.id}`)
    },
    async call() {
      await iridium.webRTC
        .call({
          recipient: this.userId,
          conversationId: this.conversationId,
          kinds: ['audio'],
        })
        .catch((e) => this.$toast.error(this.$t(e.message) as string))
    },
    /**
     * @method markdownToHtml
     * @description convert text markdown to html
     * @param str String to convert
     */
    markdownToHtml(text: string) {
      return toHTML(text, { liveTyping: false })
    },
    /**
     * @method wrapEmoji
     * @description Wraps emojis in spans with the emoji class
     * @param str String to wrap emojis within
     */
    wrapEmoji(str: string): string {
      return str.replace(
        this.$Config.regex.emojiWrapper,
        (emoji) => `<span class="emoji">${emoji}</span>`,
      )
    },
    /**
     * @method containsOnlyEmoji
     * @description Check whether or not a string only contains an emoji
     * @param str String to check against
     */
    containsOnlyEmoji(str: string): boolean {
      // return str.match(this.$Config.regex.isEmoji) !== null
      return false
    },
    /**
     * @description set timestamp
     * "now" for less than 30 sec
     * "hh:mm AM/PM" between 31 sec and a day
     * "yesterday" the day before
     * "2d" 2 days before
     * "MM/DD/YYYY" > 2 days before
     */
    setTimestamp() {
      if (!this.messages.length) {
        return
      }
      const lastMsg = this.messages.at(-1)?.at

      clearTimeout(this.timeoutId)
      if (this.$dayjs().diff(lastMsg, 'second') < 30) {
        this.timeoutId = setTimeout(() => this.setTimestamp(), 30000)
        this.timestamp = this.$t('time.now')
        return
      }
      if (this.$dayjs().isSame(lastMsg, 'day')) {
        this.timestamp = this.getTimestamp({
          time: lastMsg,
        })
      } else if (this.$dayjs().diff(lastMsg, 'day') <= 1) {
        this.timestamp = this.$t('time.yesterday')
      } else if (this.$dayjs().diff(lastMsg, 'day') <= 2) {
        this.timestamp = '2 d'
      } else {
        this.timestamp = this.getDate(lastMsg)
      }
      const midnight = this.$dayjs().add(1, 'day').startOf('day').valueOf()
      // update timestamp at midnight tonight
      this.timeoutId = setTimeout(
        () => this.setTimestamp(),
        midnight - Date.now(),
      )
    },
  },
})
</script>

<style scoped lang="less" src="./Item.less"></style>
