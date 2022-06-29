<template src="./Clickable.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapGetters, mapState } from 'vuex'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { Group } from '~/store/groups/types'
import { ContextMenuItem } from '~/store/ui/types'
import { Message, TextMessage } from '~/types/textile/mailbox'
import { MessagingTypesEnum } from '~/libraries/Enums/types/messaging-types'
import { toHTML } from '~/libraries/ui/Markdown'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  mixins: [ContextMenu],
  props: {
    group: {
      type: Object as PropType<Group>,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      textilePubkey: (state) =>
        (state as RootState).accounts?.details?.textilePubkey ?? '',
      conversations: (state) => (state as RootState).textile?.conversations,
      activeCall: (state) => (state as RootState).webrtc.activeCall,
    }),
    ...mapGetters('textile', ['getConversation']),
    ...mapGetters('settings', ['getTimestamp']),
    contextMenuValues(): ContextMenuItem[] {
      return [
        { text: this.$t('context.send'), func: this.navigateToGroup },
        // { text: this.$t('context.voice'), func: this.testFunc },
        // { text: this.$t('context.video'), func: this.testFunc },
        // { text: this.$t('context.remove'), func: this.testFunc },
      ]
    },
    hasMessaged(): boolean {
      const lastMessage = this.getConversation(this.group.id)?.lastMessage
      return !!lastMessage
    },
    lastMessage(): string {
      const conversation = this.getConversation(this.group.id)
      const lastMessage = conversation?.lastMessage

      return lastMessage
        ? this.getDescriptionFromMessage(lastMessage)
        : (this.$t('messaging.say_hi') as string)
    },
    // unreadMessageCount(): string {
    //   if (!this.user.unreadCount) {
    //     return ''
    //   }
    //   if (this.user.unreadCount < 100) {
    //     return this.user.unreadCount.toString()
    //   }
    //   return '99+'
    // },
    timestamp(): string {
      return this.getTimestamp({
        time: this.conversations[this.group.id]?.lastUpdate,
      })
    },
  },
  beforeDestroy() {
    // ensure the user can't click context menu options after a friend has been removed
    this.$store.commit('ui/toggleContextMenu', false)
  },
  methods: {
    testFunc(): void {
      this.$Logger.log('Group.vue Context', 'Test Function')
    },
    /**
     * @method navigateToGroup
     * @description Navigates to a groups page by pushing "/chat/groups/" + groups address to router
     * @param address The groups address you'd like to route to
     * @example v-on:click="navigateToGroup(group.address)"
     */
    navigateToGroup() {
      if (this.$device.isMobile) {
        // mobile, show slide 1 which is chat slide, set showSidebar flag false as css related
        this.$store.commit('ui/setSwiperSlideIndex', 1)
        this.$store.commit('ui/showSidebar', false)
        this.$store.dispatch('ui/toggleChatbarFocus', false)
      }

      if (this.group.id === this.$route.params.id) {
        if (!this.$device.isMobile) {
          this.$store.dispatch('ui/setChatbarFocus')
        }
        return
      }

      this.$store.dispatch('conversation/setConversation', {
        id: this.group.id,
        type: 'group',
        calling: false,
        participants: this.group.members,
      })

      this.$router.push(`/chat/groups/${this.group.id}`)
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
  },
})
</script>

<style scoped lang="less" src="./Clickable.less"></style>
