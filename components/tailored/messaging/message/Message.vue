<template src="./Message.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import VueMarkdown from 'vue-markdown'
import { ContextMenu } from '~/components/mixins/UI/ContextMenu'

import { Message } from '~/types/messaging'

declare module 'vue/types/vue' {
  interface Vue {
    setReplyChatbarContent: () => void
  }
}

export default Vue.extend({
  components: {
    VueMarkdown,
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
    from: {
      type: String,
      default: '',
    },
    index: {
      type: Number,
      default: -1,
    },
    setMessageHover: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      showReplies: false,
      messageHover: false,
      disData: 'DataFromTheProperty',
      contextMenuValues: [
        { text: 'Add Reaction', func: (this as any).testFunc },
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
  methods: {
    testFunc() {
      console.log('Message Func Testing ' + this.$data.disData)
    },
    mouseOver() {
      this.$data.messageHover = !this.$data.messageHover

      if (this.$props.index === 0) {
        this.$props.setMessageHover()
      }
    },
    toggleReplies() {
      this.$data.showReplies = !this.$data.showReplies
    },
    setReplyChatbarContent() {
      this.$data.showReplies = true
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
  },
})
</script>
<style lang="less" src="./Message.less"></style>
