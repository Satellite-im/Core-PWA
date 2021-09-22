<template src="./Reply.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import VueMarkdown from 'vue-markdown'

import { Reply, Message, Group } from '~/types/messaging'
import { User } from '~/types/ui/user'

export default Vue.extend({
  components: {
    VueMarkdown,
  },
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
  },
  data() {
    return { showReplies: false, replyHover: '' }
  },
  methods: {
    mouseOver(replyId: string) {
      this.$data.replyHover = replyId
    },

    emojiReaction(replyID: string) {
      this.$store.commit('settingReaction', {
        status: true,
        groupID: this.$props.group.id,
        messageID: this.$props.message.id,
        replyID: replyID,
      })
      this.$store.commit('toggleEnhancers', true)
    },
    showQuickProfile(e: Event) {
      this.$store.commit('setQuickProfilePosition', e)
      this.$store.commit('quickProfile', true)
    },
    toggleReplies() {
      this.$data.showReplies = !this.$data.showReplies
    },
  },
})
</script>
<style lang="less" src="./Reply.less"></style>
