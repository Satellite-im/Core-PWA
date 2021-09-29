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
    /**
     * @method mouseOver DocsTODO
     * @description
     * @param replyId
     * @example
     */
    mouseOver(replyId: string) {
      this.$data.replyHover = replyId
    },
    /**
     * @method emojiReaction DocsTODO
     * @description
     * @param replyId
     * @example
     */
    emojiReaction(replyID: string) {
      this.$store.commit('settingReaction', {
        status: true,
        groupID: this.$props.group.id,
        messageID: this.$props.message.id,
        replyID: replyID,
      })
      this.$store.commit('toggleEnhancers', true)
    },
    /**
     * @method showQuickProfile DocsTODO
     * @description
     * @param e
     * @example
     */
    showQuickProfile(e: Event) {
      this.$store.commit('setQuickProfilePosition', e)
      this.$store.commit('quickProfile', true)
    },
    /**
     * @method toggleReplies DocsTODO
     * @description
     * @example
     */
    toggleReplies() {
      this.$data.showReplies = !this.$data.showReplies
    },
  },
})
</script>
<style lang="less" src="./Reply.less"></style>
