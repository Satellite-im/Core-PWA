<template src="./User.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '~/types/ui/core'

export default Vue.extend({
  props: {
    user: {
      type: Object as PropType<User>,
      default: () => ({
        name: '',
        address: '',
        status: '',
      }),
      required: true,
    },
  },
  methods: {
    contextMenu(e: any) {
      e.preventDefault()
      let contextMenuStatus = this.$store.state.ui.contextMenuStatus
      if(!contextMenuStatus) { this.$store.commit('toggleContextMenu', true) }
      this.$store.commit('setContextMenuPosition', { x: e.x, y: e.y })
      let data = [
        { text: 'Send Message', func: this.testFunc.bind(this) },
        { text: 'Voice Call', func: this.testFunc },
        { text: 'Video Call', func: this.testFunc },
        { text: 'Remove Friend', func: this.testFunc }
      ]
      this.$store.commit('setContextMenuValues', data)
    },
    testFunc() {
      console.log('User Func')
    }
  }
})
</script>

<style scoped lang="less" src="./User.less"></style>
