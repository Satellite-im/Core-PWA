<template src="./ContextMenu.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  mounted() {
    this.handleOverflow()
    let el = document.querySelector('body');
    if(el){
      el.addEventListener('contextmenu', this.handleOverflow);
    }
  },
  destroyed() {
    let el = document.querySelector('body');
    if(el){
      el.removeEventListener('contextmenu', this.handleOverflow);
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
      let divHeight = this.$refs.contextMenu.clientHeight
      // @ts-ignore
      let divWidth = this.$refs.contextMenu.clientWidth
      let pageHeight = window.innerHeight
      let pageWidth = window.innerWidth
      let position = this.$store.state.ui.contextMenuPosition
      let clickX = position.x
      let clickY = position.y
      let widthOverflow = (clickX + divWidth) - pageWidth
      let heightOverflow = (clickY + divHeight) - pageHeight
      if (widthOverflow > -8) {
        clickX -= divWidth
        this.$store.commit('setContextMenuPosition', { x: clickX, y: clickY })
      }
      if (heightOverflow > -8) {
        clickY -= (heightOverflow + 12)
        this.$store.commit('setContextMenuPosition', { x: clickX, y: clickY })
      }
    }
  },
})
</script>
<style scoped lang="less" src="./ContextMenu.less"></style>
