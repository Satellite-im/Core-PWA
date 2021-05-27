<template src="./Message.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
// @ts-ignore - Missing types
import VueMarkdown from 'vue-markdown'
import { ContextMenu } from '../../../mixins/UI/ContextMenu'

import { Message } from '~/types/messaging'

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
  },
  data() {
    return {
      disData: 'DataFromTheProperty',
      contextMenuValues: [
        { text: 'Add Reaction', func: (this as any).testFunc },
        { text: 'Reply', func: (this as any).testFunc },
        { text: 'Copy Message', func: (this as any).testFunc },
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
  },
})
</script>
<style lang="less" src="./Message.less"></style>
