<template src="./DragBar.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SideType } from './types'

export default Vue.extend({
  name: 'DragBar',
  props: {
    side: {
      type: String as PropType<SideType>,
      required: true,
    },
    showHandle: {
      type: Boolean,
      default: () => false,
    },
    overlay: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => ({
    isDragging: false,
    startPoint: null as number | null,
  }),
  computed: {
    isVertical(): boolean {
      return this.side === 'top' || this.side === 'bottom'
    },
  },
  beforeDestroy() {
    this.removeEventListeners()
  },
  methods: {
    handleMouseDown(event: MouseEvent) {
      this.addEventListeners()
      this.isDragging = true
      this.initialEvent = event
      this.initialClientRect = this.$parent.$el.getBoundingClientRect()
    },
    handleMouseMove(event: MouseEvent) {
      if (!this.isDragging) {
        return
      }
      const delta = this.isVertical
        ? event.y - this.initialEvent.y
        : event.x - this.initialEvent.x

      const emitValue = this.isVertical
        ? this.initialClientRect.height + delta
        : this.initialClientRect.width + delta

      this.$emit('resize', `${emitValue}px`)
    },
    handleMouseUp(event: MouseEvent) {
      this.removeEventListeners()
      this.isDragging = false
      this.initialEvent = undefined
    },
    addEventListeners() {
      document.addEventListener('mousemove', this.handleMouseMove)
      document.addEventListener('mouseup', this.handleMouseUp)
    },
    removeEventListeners() {
      if (!this.isDragging) {
        return
      }
      document.removeEventListener('mousemove', this.handleMouseMove)
      document.removeEventListener('mouseup', this.handleMouseUp)
    },
  },
})
</script>
<style scoped lang="less" src="./DragBar.less"></style>
