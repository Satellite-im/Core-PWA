<template src="./GlowingCursorArea.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    hide: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return { xChild: 0, yChild: 0, hideCursor: true }
  },
  computed: {
    cursorPoint(): string {
      return `
        transform: translate(${this.xChild}px, ${this.yChild}px);
        opacity: ${this.hideCursor || this.hide ? 0 : 1};
      `
    },
  },
  methods: {
    moveCursor(e: MouseEvent) {
      const bounds = (e.target as HTMLElement).getBoundingClientRect()
      this.xChild = e.clientX - bounds.left
      this.yChild = e.clientY - bounds.top
    },
  },
})
</script>
<style scoped lang="less" src="./GlowingCursorArea.less"></style>
