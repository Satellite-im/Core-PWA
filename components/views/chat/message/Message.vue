<template src="./Message.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

import { ArchiveIcon } from 'satellite-lucide-icons'
import ContextMenu from '~/components/mixins/UI/ContextMenu'
import { Config } from '~/config'
import { UIMessage, Group } from '~/types/messaging'
import { refreshTimestampInterval } from '~/utilities/Messaging'
import { toHTML } from '~/libraries/ui/Markdown'

declare module 'vue/types/vue' {
  interface Vue {
    setReplyChatbarContent: () => void
    quickReaction: (emoji: String) => void
    editMessage: () => void
    emojiReaction: (e: MouseEvent) => void
  }
}

export default Vue.extend({
  components: {
    ArchiveIcon,
  },
  mixins: [ContextMenu],
  props: {
    message: {
      type: Object as PropType<UIMessage>,
      default: () => ({
        id: '0',
        at: 1620515543000,
        type: 'text',
        payload: 'Invalid Message',
      }),
    },
    group: {
      type: Object as PropType<Group>,
      default: () => {},
    },
    from: {
      type: String,
      default: '',
    },
    index: {
      type: Number,
      default: -1,
    },
    hideActions: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      disData: 'DataFromTheProperty',
      contextMenuValues: [
        { text: 'quickReaction', func: this.quickReaction },
        { text: this.$t('context.edit'), func: this.editMessage },
        { text: this.$t('context.reaction'), func: this.emojiReaction },
        { text: this.$t('context.reply'), func: this.setReplyChatbarContent },
        {
          text: this.$t('context.copy_msg'),
          func: () => {
            const { type, payload } = this.$props.message
            let finalPayload = payload
            if (['image', 'video', 'audio', 'file'].includes(type)) {
              finalPayload = this.$t('conversation.multimedia')
            }
            this.$envinfo.navigator.clipboard.writeText(finalPayload)
          },
        },
        { text: this.$t('context.copy_img'), func: (this as any).testFunc },
        { text: this.$t('context.save'), func: (this as any).testFunc },
        { text: this.$t('context.copy_link'), func: (this as any).testFunc },
      ],
      timestampRefreshInterval: null,
      timestamp: this.$dayjs(this.$props.message.at).fromNow(),
    }
  },
  computed: {
    ...mapState(['ui', 'textile', 'accounts']),
    hasReactions() {
      return (
        this.$props.message.reactions && this.$props.message.reactions.length
      )
    },
    messageEdit() {
      return this.ui.editMessage.id === this.$props.message.id
    },
  },
  created() {
    const setTimestamp = (timePassed: string) => {
      this.$data.timestamp = timePassed
    }

    this.$data.timestampRefreshInterval = refreshTimestampInterval(
      this.$props.message.at,
      setTimestamp,
      Config.chat.timestampUpdateInterval,
    )
  },
  beforeDestroy() {
    clearInterval(this.$data.refreshTimestampEveryMinute)
  },
  methods: {
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
     * @description Check wether or not a string only contains an emoji
     * @param str String to check against
     */
    containsOnlyEmoji(str: string): boolean {
      return str.match(this.$Config.regex.isEmoji) !== null
    },
    testFunc() {
      this.$Logger.log('Message Context', 'Test func')
    },
    /**
     * @method setReplyChatbarContent DocsTODO
     * @description
     * @example
     */
    setReplyChatbarContent() {
      const myTextilePublicKey = this.$TextileManager.getIdentityPublicKey()
      const { id, type, payload, to, from } = this.$props.message
      let finalPayload = payload
      if (['image', 'video', 'audio', 'file'].includes(type)) {
        finalPayload = `*${this.$t('conversation.multimedia')}*`
      } else if (type === 'glyph') {
        finalPayload = `<img src=${payload} width='16px' height='16px' />`
      }
      this.$store.commit('ui/setReplyChatbarContent', {
        id,
        payload: finalPayload,
        from: this.$props.from,
        messageID: this.$props.message.id,
        to: to === myTextilePublicKey ? from : to,
      })
      this.$store.dispatch('ui/setChatbarFocus')
    },
    /**
     * @method emojiReaction DocsTODO
     * @description
     * @example
     */
    emojiReaction(e: MouseEvent) {
      const myTextilePublicKey = this.$TextileManager.getIdentityPublicKey()
      this.$store.commit('ui/settingReaction', {
        status: true,
        groupID: this.$props.group.id,
        messageID: this.$props.message.id,
        to:
          this.$props.message.to === myTextilePublicKey
            ? this.$props.message.from
            : this.$props.message.to,
      })
      let xVal = this.$el.getBoundingClientRect().x
      let yVal = this.$el.getBoundingClientRect().y
      if (e) {
        xVal = e.clientX
        yVal = e.clientY
      }
      this.$store.commit('ui/toggleEnhancers', {
        show: true,
        floating: !!this.$device.isMobile,
        position: [xVal, yVal],
        containerWidth: this.$el.clientWidth,
      })
    },
    quickReaction(emoji: String) {
      this.$store.dispatch('ui/addReaction', {
        emoji,
        reactor: this.$mock.user.name,
        groupID: this.$props.group.id,
        messageID: this.$props.message.id,
      })
    },
    /**
     * Called when click the "Edit Message" on context menu
     * Commit store mutation in order to notify the edit status
     */
    editMessage() {
      const { id, payload, type, from } = this.$props.message
      if (type === 'text' && from === this.accounts.details.textilePubkey) {
        this.$store.commit('ui/setEditMessage', {
          id,
          payload,
          from: this.$props.group.id,
        })
      }
    },
    /**
     * Called from MessageEdit component when complete to edit message
     * Called from MessageEdit component with changed message When save or cancel / Enter or Escape is pressed
     */
    saveMessage(message: string) {
      this.$store.commit('ui/setEditMessage', {
        id: '',
        payload: message,
        from: this.$props.group.id,
      })
      this.$store.commit('ui/saveEditMessage', {
        id: this.$props.message.id,
        payload: message,
        from: this.$props.group.id,
      })

      if (message !== this.$props.message.payload) {
        const recipient = this.$Hounddog.getActiveFriend(
          this.$store.state.friends,
        )
        this.$store.dispatch('textile/editTextMessage', {
          to: recipient?.textilePubkey,
          original: this.$props.message,
          text: message,
        })
      }
    },
    cancelMessage() {
      this.$store.commit('ui/setEditMessage', {
        id: '',
        payload: '',
        from: this.$props.group.id,
      })

      this.$store.commit('ui/saveEditMessage', {
        id: this.$props.message.id,
        payload: 'message',
        from: this.$props.group.id,
      })
    },
  },
})
</script>
<style lang="less" src="./Message.less"></style>
