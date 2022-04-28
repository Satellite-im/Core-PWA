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
      return `transform: translateX(${this.xChild + 10}px) translateY(${
        this.yChild + 4
      }px) translateZ(0) translate3d(0, 0, 0);`
    },
  },
  methods: {
    /**
     * @method moveCursor DocsTODO
     * @description
     * @param e
     * @returns
     * @example
     */
    moveCursor(e: Event | any) {
      const bounds = e.target.getBoundingClientRect()

      this.xChild = e.clientX - bounds.left
      this.yChild = e.clientY - bounds.top
    },
  },
})
</script>
<style scoped lang="less" src="./GlowingCursorArea.less"></style>
