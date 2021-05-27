<template src="./ContextMenu.html"></template>
<script lang="ts">
import Vue from 'vue'

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
  methods: {
    close() {
      this.$store.commit('toggleContextMenu', false)
    },
    handle(func: any) {
      func()
      this.close()
    },
    handleOverflow() {
      // @ts-ignore
      const divHeight = this.$refs.contextMenu.clientHeight
      // @ts-ignore
      const divWidth = this.$refs.contextMenu.clientWidth
      const pageHeight = window.innerHeight
      const pageWidth = window.innerWidth
      const position = this.$store.state.ui.contextMenuPosition
      let clickX = position.x
      let clickY = position.y
      const widthOverflow = clickX + divWidth - pageWidth
      const heightOverflow = clickY + divHeight - pageHeight
      if (widthOverflow > -8) {
        clickX -= divWidth
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
