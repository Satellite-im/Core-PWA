<template src="./Conversation.html"></template>
<script lang="ts">
// eslint-disable-next-line import/named
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
})
</script>
<style scoped lang="less" src="./Conversation.less"></style>
