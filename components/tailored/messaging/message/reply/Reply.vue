<template src="./Reply.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import VueMarkdown from 'vue-markdown'
import { ContextMenu } from '~/components/mixins/UI/ContextMenu'

import { Reply } from '~/types/messaging'

export default Vue.extend({
  components: {
    VueMarkdown,
  },
  //   mixins: [ContextMenu],
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
  },
  //   data() {
  //     return {
  //       disData: 'DataFromTheProperty',
  //       contextMenuValues: [
  //         { text: 'Add Reaction', func: (this as any).testFunc },
  //         { text: 'Reply', func: (this as any).testFunc },
  //         { text: 'Copy Message', func: (this as any).testFunc },
  //         { text: 'Copy Image', func: (this as any).testFunc },
  //         { text: 'Save Image', func: (this as any).testFunc },
  //         { text: 'Copy Link', func: (this as any).testFunc },
  //       ],
  //     }
  //   },
  methods: {
    showQuickProfile(e: Event) {
      this.$store.commit('setQuickProfilePosition', e)
      this.$store.commit('quickProfile', true)
    },
  },
})
</script>
<style lang="less" src="./Reply.less"></style>
