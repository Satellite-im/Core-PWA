<template src="./Item.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { TranslateResult } from 'vue-i18n'
import VueMarkdown from 'vue-markdown'
import { RootState } from '~/types/store/store'
import { toHTML } from '~/libraries/ui/Markdown'
import { ContextMenuItem } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'
import { User } from '~/libraries/Iridium/friends/types'
import Group from '~/libraries/Iridium/groups/Group'

export default Vue.extend({
  components: {
    VueMarkdown,
  },
  props: {
    conversation: {
      type: Object as PropType<Conversation>,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      timestamp: '' as string | TranslateResult,
      timeoutId: undefined as NodeJS.Timeout | undefined,
      friends: iridium.friends.list,
      groups: iridium.groups.state,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      accounts: (state) => (state as RootState).accounts,
    }),
    ...mapGetters('settings', ['getTimestamp', 'getDate']),
    contextMenuValues(): ContextMenuItem[] {
      return this.conversation.type === 'direct'
        ? [
            { text: this.$t('context.send'), func: this.openConversation },
            {
              text: this.$t('context.profile'),
              func: () =>
                this.$store.dispatch('ui/showProfile', this.conversation),
            },
            {
              text: this.$t('context.remove'),
              func: this.removeFriend,
              type: 'danger',
            },
          ]
        : [
            { text: this.$t('context.send'), func: this.openConversation },
            {
              text: this.$t('context.leave_group'),
              func: this.leaveGroup,
              type: 'danger',
            },
          ]
    },
    messages(): ConversationMessage[] {
      return Object.values(this.conversation.message).sort(
        (a, b) => a.at - b.at,
      )
    },

    lastMessageDisplay(): string {
      const lastMessage = this.messages.at(-1)
      if (!lastMessage) {
        return this.$t('messaging.say_hi') as string
      }
      return lastMessage.body || ''

      // const sender = message.from === iridium.connector?.id ? 'me' : 'user'

      // switch (message.type) {
      //   case MessagingTypesEnum.TEXT:
      //     return message.payload
      //   case MessagingTypesEnum.FILE:
      //   case MessagingTypesEnum.GLYPH:
      //     return this.$t(`messaging.user_sent.${sender}`, {
      //       msgType: message.type,
      //     }) as string
      //   default:
      //     return this.$t(`messaging.user_sent_something.${sender}`) as string
      // }
    },

    details(): User | Group | undefined {
      if (this.conversation.type === 'direct') {
        const friendDid = this.conversation.participants.find(
          (f) => f !== iridium.connector?.id,
        )
        return this.friends.find((f) => f.did === friendDid)
      }
      return this.groups[this.conversation.id]
    },

    isSelected(): boolean {
      return this.conversation.id === this.$route.params.id
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
    this.clearTimeoutId()
    this.$store.commit('ui/toggleContextMenu', false)
  },
  methods: {
    async removeFriend() {
      if (!(this.details as User)?.did) {
        return
      }
      this.isLoading = true
      await iridium.friends
        .friendRemove((this.details as User).did)
        .catch((e) => this.$toast.error(this.$t(e.message) as string))
      this.isLoading = false
    },
    async leaveGroup() {
      iridium.groups.leaveGroup(this.conversation.id)
    },
    /**
     * @method openConversation
     * @description Navigates to user or group conversation
     */
    async openConversation() {
      if (this.$device.isMobile) {
        this.$router.push({ params: { id: this.conversation.id } })
        return
      }
      this.$router.push(`/chat/${this.conversation.id}`)
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

      if (this.$dayjs().diff(lastMsg, 'second') < 30) {
        this.clearTimeoutId()
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
      this.clearTimeoutId()
      // update timestamp at midnight tonight
      this.timeoutId = setTimeout(
        () => this.setTimestamp(),
        midnight - Date.now(),
      )
    },
    clearTimeoutId() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Item.less"></style>
