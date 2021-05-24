<template src="./Conversation.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { MessageGroup } from '~/types/messaging'

export default Vue.extend({
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    messages: {
      type: Array as PropType<MessageGroup>,
      default: () => [],
    },
  },
  data() {
    return {
      updated: Date.now(),
      updateInterval: null,
    }
  },
  mounted() {
    // Updates time ago
    this.$data.updateInterval = setInterval(() => {
      this.updated = Date.now()
    }, 60000)
  },
  beforeDestroy() {
    clearInterval(this.$data.updateInterval)
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
