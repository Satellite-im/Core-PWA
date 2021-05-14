<template src="./Message.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
// @ts-ignore - Missing types
import VueMarkdown from 'vue-markdown'

import { Message } from '~/types/messaging'

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
  },
})
</script>
<style lang="less" src="./Message.less"></style>
