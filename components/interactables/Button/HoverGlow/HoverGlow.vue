<template src="./HoverGlow.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    action: {
      type: Function,
      required: false,
      default: () => {},
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  methods: {
    mouseLeave(e: MouseEvent) {
      const target = e?.target

      target.style = ''
    },
    mouseEnter(e: MouseEvent) {
      const target = e.target

      const rect = target.getBoundingClientRect()
      target.style.setProperty('--circle-size', `${rect.height * 2}px`)
    },
    mouseMove(e: MouseEvent) {
      const target = e.target

      const rect = target.getBoundingClientRect()

      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      target.style.setProperty('--mouse-x', `${x}px`)
      target.style.setProperty('--mouse-y', `${y}px`)
    },
  },
})
</script>
<style scoped lang="less" src="./HoverGlow.less"></style>
