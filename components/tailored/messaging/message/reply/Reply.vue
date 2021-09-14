<template src="./Reply.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import VueMarkdown from 'vue-markdown'

import { Reply, Message } from '~/types/messaging'

export default Vue.extend({
  components: {
    VueMarkdown,
  },
  props: {
    reply: {
      type: Object as PropType<Reply>,
      default: () => ({
        id: '0',
        at: 1620515543000,
        type: 'text',
        payload: 'Invalid Reply',
      }),
    },
    message: {
      type: Object as PropType<Message>,
      default: () => ({
        id: '0',
        at: 1620515543000,
        type: 'text',
        payload: 'Invalid Message',
      }),
    },
  },
  data() {
    return { showReplies: false }
  },
  methods: {
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
