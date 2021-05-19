<template src="./Message.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
// @ts-ignore - Missing types
import VueMarkdown from 'vue-markdown'
import { ContextMenu } from '../../../mixins/UI/ContextMenu'

import { Message } from '~/types/messaging'

export default Vue.extend({
  mixins: [ContextMenu],
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
  data() {
    return {
      disData: 'DataFromTheProperty',
      contextMenuValues: [
        // @ts-ignore
        { text: 'Add Reaction', func: this.testFunc },
        // { text: 'Reply', func: this.testFunc },
        // { text: 'Copy Message', func: this.testFunc },
        // { text: 'Copy Image', func: this.testFunc },
        // { text: 'Save Image', func: this.testFunc },
        // { text: 'Copy Link', func: this.testFunc }
      ]
    }
  },
  methods: {
    testFunc() {
      console.log('Message Func Testing ' + this.$data.disData )
    }
  }
})
</script>
<style lang="less" src="./Message.less"></style>
