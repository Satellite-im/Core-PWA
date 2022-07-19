<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState, mapGetters } from 'vuex'
import { TranslateResult } from 'vue-i18n'
import VueMarkdown from 'vue-markdown'

import { SmartphoneIcon, CircleIcon } from 'satellite-lucide-icons'

import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { Message, TextMessage } from '~/types/textile/mailbox'
import { MessagingTypesEnum } from '~/libraries/Enums/enums'
import { RootState } from '~/types/store/store'
import { toHTML } from '~/libraries/ui/Markdown'
import { ContextMenuItem } from '~/store/ui/types'
import type { User } from '~/libraries/Iridium/friends/types'
import iridium from '~/libraries/Iridium/IridiumManager'
export default Vue.extend({
  components: {
    VueMarkdown,
    SmartphoneIcon,
    CircleIcon,
  },
  mixins: [ContextMenu],
  props: {
    user: {
      type: Object as PropType<User>,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
      required: false,
    },
    isTyping: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      existConversation: false,
      isLoading: false,
      timeoutId: undefined as NodeJS.Timeout | undefined,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      textilePubkey: (state) =>
        (state as RootState).accounts?.details?.textilePubkey ?? '',
      conversations: (state) => (state as RootState).textile?.conversations,
    }),
    ...mapGetters('textile', ['getConversation']),
    ...mapGetters('settings', ['getTimestamp', 'getDate']),
    contextMenuValues(): ContextMenuItem[] {
      return this.user.state === 'online'
        ? [
            { text: this.$t('context.send'), func: this.navigateToUser },
            { text: this.$t('context.voice'), func: this.testFunc },
            { text: this.$t('context.video'), func: this.testFunc },
            // hide profile modal depend on this task AP-1717 (https://satellite-im.atlassian.net/browse/AP-1717)
            // { text: this.$t('context.profile'), func: this.handleShowProfile },
            { text: this.$t('context.remove'), func: this.removeUser },
          ]
        : [
            { text: this.$t('context.send'), func: this.navigateToUser },
            // hide profile modal depend on this task AP-1717 (https://satellite-im.atlassian.net/browse/AP-1717)
            //   { text: this.$t('context.profile'), func: this.handleShowProfile },
            { text: this.$t('context.remove'), func: this.removeUser },
          ]
    },
    hasMessaged(): boolean {
      const lastMessage = this.getConversation(this.user.did)?.lastMessage
      return !!lastMessage
    },
    lastMessage(): string {
      const conversation = this.getConversation(this.user.did)
      const lastMessage = conversation?.lastMessage

      return lastMessage
        ? this.getDescriptionFromMessage(lastMessage)
        : (this.$t('messaging.say_hi') as string)
    },
    src(): string {
      const hash = this.user?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
    unreadMessageCount(): string {
      if (!this.user.unreadCount) {
        return ''
      }
      if (this.user.unreadCount < 100) {
        return this.user.unreadCount.toString()
      }
      return '99+'
    },
    timestamp(): string {
      return this.getTimestamp({
        time: this.conversations[this.user.did]?.lastUpdate,
      })
    },
  },
  // watch: {
  //   user: {
  //     handler() {
  //       this.setTimestamp()
  //     },
  //     deep: true,
  //   },
  // },
  mounted() {
    Array.from(
      (this.$refs.subtitle as HTMLElement).getElementsByClassName(
        'spoiler-container',
      ),
    ).forEach((spoiler) => {
      spoiler.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        spoiler.classList.add('spoiler-open')
      })
    })
    // this.setTimestamp()
  },
  beforeDestroy() {
    // this.clearTimeoutId()
    this.$store.commit('ui/toggleContextMenu', false)
  },
  methods: {
    testFunc() {
      this.$Logger.log('User Context', 'Test func')
    },
    async removeUser() {
      this.isLoading = true
      try {
        await this.$store.dispatch('friends/removeFriend', this.user)
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

      if (this.user.did === this.$route.params.did) {
        this.$store.dispatch('ui/setChatbarFocus')
        return
      }
      const id = await iridium.chat?.directConversationId(this.user.did)

      if (id && !(await iridium.chat?.hasConversation(id))) {
        await iridium.chat?.createConversation(this.user?.name, 'direct', [
          this.user?.did,
          iridium.connector?.id,
        ])
      }

      // this.$store.dispatch('conversation/setConversation', {
      //   id: this.user.did,
      //   type: 'friend',
      //   participants: [this.user],
      //   calling: false,
      // })

      this.$router.push(id ? `/chat/direct/${id}` : `/`)
    },
    handleShowProfile() {
      this.$store.dispatch('ui/showProfile', this.user)
    },
    getDescriptionFromMessage(message: Message): string {
      const sender = message.from === this.textilePubkey ? 'me' : 'user'

      switch (message.type) {
        case MessagingTypesEnum.TEXT:
          return (message as TextMessage).payload
        case MessagingTypesEnum.FILE:
        case MessagingTypesEnum.GLYPH:
          return this.$t(`messaging.user_sent.${sender}`, {
            msgType: message.type,
          }) as string
        default:
          return this.$t(`messaging.user_sent_something.${sender}`) as string
      }
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
      return str.match(this.$Config.regex.isEmoji) !== null
    },
    // /**
    //  * @description set timestamp
    //  * "now" for less than 30 sec
    //  * "hh:mm AM/PM" between 31 sec and a day
    //  * "yesterday" the day before
    //  * "2d" 2 days before
    //  * "MM/DD/YYYY" > 2 days before
    //  */
    // setTimestamp() {
    //   // set now, update timestamp after 30s
    //   if (this.$dayjs().diff(this.user.lastUpdate, 'second') < 30) {
    //     this.clearTimeoutId()
    //     this.timeoutId = setTimeout(() => this.setTimestamp(), 30000)
    //     this.timestamp = this.$t('time.now')
    //     return
    //   }
    //   if (this.$dayjs().isSame(this.user.lastUpdate, 'day')) {
    //     this.timestamp = this.getTimestamp({ time: this.user.lastUpdate })
    //   } else if (this.$dayjs().diff(this.user.lastUpdate, 'day') <= 1) {
    //     this.timestamp = this.$t('time.yesterday')
    //   } else if (this.$dayjs().diff(this.user.lastUpdate, 'day') <= 2) {
    //     this.timestamp = '2 d'
    //   } else {
    //     this.timestamp = this.getDate(this.user.lastUpdate)
    //   }
    //   const midnight = this.$dayjs().add(1, 'day').startOf('day').valueOf()
    //   this.clearTimeoutId()
    //   // update timestamp at midnight tonight
    //   this.timeoutId = setTimeout(
    //     () => this.setTimestamp(),
    //     midnight - Date.now(),
    //   )
    // },
    // clearTimeoutId() {
    //   if (this.timeoutId) {
    //     clearTimeout(this.timeoutId)
    //   }
    // },
  },
})
</script>

<style scoped lang="less" src="./User.less"></style>
