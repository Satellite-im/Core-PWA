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
        { text: 'quickReaction', func: (this as any).quickReaction },
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
    /**
     * @method mouseOver DocsTODO
     * @description
     * @example
     */
    mouseOver() {
      this.$data.messageHover = !this.$data.messageHover
    },
    /**
     * @method setReplyChatbarContent DocsTODO
     * @description
     * @example
     */
    setReplyChatbarContent() {
      const { id, type, payload } = this.$props.message
      let finalPayload = payload
      if (['image', 'video', 'audio', 'file'].includes(type)) {
        finalPayload = `*${this.$t('conversation.multimedia')}*`
      }

      this.$store.commit('ui/setReplyChatbarContent', {
        id,
        payload: finalPayload,
        from: this.$props.from,
      })
    },
    /**
     * @method emojiReaction DocsTODO
     * @description
     * @example
     */
    emojiReaction() {
      this.$store.commit('ui/settingReaction', {
        status: true,
        groupID: this.$props.group.id,
        messageID: this.$props.message.id,
      })
      this.$store.commit('ui/toggleEnhancers', { show: true, floating: true })
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
      const { id, payload } = this.$props.message
      this.$store.commit('ui/setEditMessage', {
        id,
        payload,
        from: this.$props.group.id,
      })
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
    },
  },
})
</script>
<style lang="less" src="./Message.less"></style>
