<template src="./Message.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
// @ts-ignore
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
  data() {
    return {
      disData: 'DataFromTheProperty'
    }
  },
  methods: {
    contextMenu(e: any) {
      e.preventDefault()
      let contextMenuStatus = this.$store.state.ui.contextMenuStatus
      if(!contextMenuStatus) { this.$store.commit('toggleContextMenu', true) }
      this.$store.commit('setContextMenuPosition', { x: e.x, y: e.y })
      let data = [
        { text: 'Add Reaction', func: this.testFunc },
        { text: 'Reply', func: this.testFunc },
        { text: 'Copy Message', func: this.testFunc },
        { text: 'Copy Image', func: this.testFunc },
        { text: 'Save Image', func: this.testFunc },
        { text: 'Copy Link', func: this.testFunc }
      ]
      this.$store.commit('setContextMenuValues', data)
    },
    testFunc() {
      console.log('Message Func Testing ' + this.$data.disData )
    }
  }
})
</script>
<style lang="less" src="./Message.less"></style>
