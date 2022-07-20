<template src="./Item.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { TranslateResult } from 'vue-i18n'
import VueMarkdown from 'vue-markdown'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { RootState } from '~/types/store/store'
import { toHTML } from '~/libraries/ui/Markdown'
import { ContextMenuItem } from '~/store/ui/types'
import iridium from '~/libraries/Iridium/IridiumManager'
import {
  Conversation,
  ConversationMessage,
} from '~/libraries/Iridium/chat/types'
import { User } from '~/libraries/Iridium/friends/types'

export default Vue.extend({
  components: {
    VueMarkdown,
  },
  mixins: [ContextMenu],
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
      // friends: iridium.friends.state,
      messages: iridium.chat.messages[this.conversation.id],
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    ...mapGetters('settings', ['getTimestamp', 'getDate']),
    contextMenuValues(): ContextMenuItem[] {
      // return this.user.status === 'online'
      //   ? [
      //       { text: this.$t('context.send'), func: this.navigateToUser },
      //       { text: this.$t('context.voice'), func: this.testFunc },
      //       { text: this.$t('context.video'), func: this.testFunc },
      //       // hide profile modal depend on this task AP-1717 (https://satellite-im.atlassian.net/browse/AP-1717)
      //       // { text: this.$t('context.profile'), func: this.handleShowProfile },
      //       { text: this.$t('context.remove'), func: this.removeUser },
      //     ]
      //   : [
      //       { text: this.$t('context.send'), func: this.navigateToUser },
      //       // hide profile modal depend on this task AP-1717 (https://satellite-im.atlassian.net/browse/AP-1717)
      //       //   { text: this.$t('context.profile'), func: this.handleShowProfile },
      //       { text: this.$t('context.remove'), func: this.removeUser },
      //     ]
      return [
        { text: this.$t('context.send'), func: this.navigateToUser },
        {
          text: this.$t('context.profile'),
          func: () => this.$store.dispatch('ui/showProfile', this.conversation),
        },
        { text: this.$t('context.remove'), func: this.removeUser },
      ]
    },
    lastMessage(): ConversationMessage | undefined {
      if (!this.messages.length) {
        return undefined
      }

      return this.messages[this.messages.length - 1]
    },

    lastMessageDisplay(): string {
      if (!this.lastMessage) {
        return this.$t('messaging.say_hi') as string
      }
      return this.lastMessage.body

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

    friendDetails(): User | undefined {
      if (this.conversation.type === 'direct') {
        const friendDid = this.conversation.participants.find(
          (f) => f !== iridium.connector?.id,
        )
        return iridium.friends.state.list.find((f) => f.did === friendDid)
      }
      return undefined
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
    async removeUser() {
      this.isLoading = true
      try {
        await this.$store.dispatch('friends/removeFriend', this.conversation)
      } catch (e) {
        this.$toast.error(
          this.$t('errors.friends.friend_not_removed') as string,
        )
      } finally {
        this.isLoading = false
      }
    },
    /**
     * @method navigateToUser
     * @description Navigates to chat with specific user by pushing "/chat/direct/" + users ID to the router
     * Pretty sure this is just a placeholder for what will be the actual function?
     * @example ---
     */
    async navigateToUser() {
      if (this.$device.isMobile) {
        // mobile, show slide 1 which is chat slide, set showSidebar flag false as css related
        this.$store.commit('ui/setSwiperSlideIndex', 1)
        this.$store.commit('ui/showSidebar', false)
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