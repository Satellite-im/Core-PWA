<template src="./ContextMenu.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  mounted() {
    this.handleOverflow()
    const el = document.querySelector('body')
    if (el) {
      el.addEventListener('contextmenu', this.handleOverflow)
    }
  },
  destroyed() {
    const el = document.querySelector('body')
    if (el) {
      el.removeEventListener('contextmenu', this.handleOverflow)
    }
  },
  computed: {
    ...mapState(['settings']),
  },
  methods: {
    close() {
      this.$store.commit('toggleContextMenu', false)
    },
    handle(func: any) {
      func()
      this.close()
    },
    handleOverflow() {
      const contextMenu = this.$refs.contextMenu as HTMLElement
      const position = this.ui.contextMenuPosition
      let clickX = position.x
      let clickY = position.y
      const widthOverflow = clickX + contextMenu.clientWidth - window.innerWidth
      const heightOverflow =
        clickY + contextMenu.clientHeight - window.innerHeight
      if (widthOverflow > -8) {
        clickX -= contextMenu.clientWidth
        this.$store.commit('setContextMenuPosition', { x: clickX, y: clickY })
      }
      if (heightOverflow > -8) {
        clickY -= heightOverflow + 12
        this.$store.commit('setContextMenuPosition', { x: clickX, y: clickY })
      }
    },
  },
})
</script>
<style scoped lang="less" src="./ContextMenu.less"></style>
