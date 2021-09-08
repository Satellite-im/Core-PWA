<template src="./CustomCursorArea.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return { xChild: 0, yChild: 0, xParent: 0, yParent: 0, hideCursor: true }
  },
  computed: {
    cursorPoint(): string {
      return `transform: translateX(${this.xChild - 15}px) translateY(${
        this.yChild - 15
      }px) translateZ(0) translate3d(0, 0, 0);`
    },
  },
  methods: {
    moveCursor(e: Event | any) {
      this.xChild = e.clientX
      this.yChild = e.clientY
      setTimeout(() => {
        this.xParent = e.clientX - 15
        this.yParent = e.clientY - 15
      }, 1000)
    },
  },
  mounted() {
    document.addEventListener('mousemove', this.moveCursor)
  },
})
</script>
<style scoped lang="less" src="./CustomCursorArea.less"></style>
