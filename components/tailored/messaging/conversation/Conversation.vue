<template src="./Conversation.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
// import { Capacitor } from '@capacitor/core'
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
    this.$data.updateInterval = setInterval(() => {
      this.updated = Date.now()
    }, 6000)
  },
  beforeDestroy() {
    clearInterval(this.$data.updateInterval)
  },
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
