<template src="./Message.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

import { ArchiveIcon } from 'satellite-lucide-icons'

import VueMarkdown from 'vue-markdown'
import { ContextMenu } from '~/components/mixins/UI/ContextMenu'
import { Message, Group } from '~/types/messaging'

declare module 'vue/types/vue' {
  interface Vue {
    setReplyChatbarContent: () => void
  }
}

export default Vue.extend({
  components: {
    VueMarkdown,
    ArchiveIcon,
  },
  mixins: [ContextMenu],
  props: {
    message: {
      type: Object as PropType<Message>,
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
    setMessageHover: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      messageHover: false,
      disData: 'DataFromTheProperty',
      contextMenuValues: [
        // eslint-disable-next-line prettier/prettier
        { text: this.ui.recentReactions[0], func() { (this as any).quickReaction((this as any).ui.recentReactions[0]) } },
        { text: 'Edit Message', func: (this as any).editMessage },
        { text: 'Add Reaction', func: (this as any).emojiReaction },
        { text: 'Reply', func: this.setReplyChatbarContent },
        {
          text: 'Copy Message',
          func: () => {
            const { type, payload } = this.$props.message
            let finalPayload = payload
            if (['image', 'video', 'audio', 'file'].includes(type)) {
              finalPayload = this.$t('conversation.multimedia')
            }
            navigator.clipboard.writeText(finalPayload)
          },
        },
        { text: 'Copy Image', func: (this as any).testFunc },
        { text: 'Save Image', func: (this as any).testFunc },
        { text: 'Copy Link', func: (this as any).testFunc },
      ],
    }
  },
  computed: {
    ...mapState(['ui']),

    hasReactions() {
      return (
        this.$props.message.reactions && this.$props.message.reactions.length
      )
    },
    messageEdit() {
      return this.ui.editMessage.id === this.$props.message.id
    },
  },
  methods: {
    testFunc() {
      console.log('Message Func Testing ' + this.$data.disData)
    },
    mouseOver() {
      this.$data.messageHover = !this.$data.messageHover
    },
    setReplyChatbarContent() {
      const { id, type, payload } = this.$props.message
      let finalPayload = payload
      if (['image', 'video', 'audio', 'file'].includes(type)) {
        finalPayload = `*${this.$t('conversation.multimedia')}*`
      }

      this.$store.commit('setReplyChatbarContent', {
        id,
        payload: finalPayload,
        from: this.$props.from,
      })
    },
    emojiReaction() {
      this.$store.commit('settingReaction', {
        status: true,
        groupID: this.$props.group.id,
        messageID: this.$props.message.id,
      })
      this.$store.commit('toggleEnhancers', true)
    },
    quickReaction(emoji: String) {
      this.$store.dispatch('addReaction', {
        emoji,
        reactor: this.$mock.user.name,
        groupID: this.$props.group.id,
        messageID: this.$props.message.id,
        replyID: this.$props.reply.id,
      })
    },
    /**
     * Called when click the "Edit Message" on context menu
     * Commit store mutation in order to notify the edit status
     */
    editMessage() {
      const { id, payload } = this.$props.message
      this.$store.commit('setEditMessage', {
        id,
        payload,
        from: this.$props.group.id,
      })
    },
    /**
     * Called from MessageEdit component when complete to edit message
     */
    saveMessage(message: string) {
      this.$store.commit('setEditMessage', {
        id: '',
        payload: message,
        from: this.$props.group.id,
      })
      this.$store.commit('saveEditMessage', {
        id: this.$props.message.id,
        payload: message,
        from: this.$props.group.id,
      })
    },
  },
})
</script>
<style lang="less" src="./Message.less"></style>
