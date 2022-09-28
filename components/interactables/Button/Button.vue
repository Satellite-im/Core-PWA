<template src="./Button.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

import { ButtonType, ButtonSize } from './types.d'

export default Vue.extend({
  props: {
    size: {
      type: String as PropType<ButtonSize>,
      default: 'md',
    },
    color: {
      type: String as PropType<ButtonType>,
      default: 'primary',
    },
    text: {
      type: String,
      default: '',
    },
    outlined: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'button',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    // aria label for accessibility
    label: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      cursorX: 0,
      cursorY: 0,
      showCursorGlow: false,
    }
  },
  computed: {
    cursorGlowStyle(): {
      backgroundPosition: string
      opacity: number
    } {
      return {
        backgroundPosition: `left ${this.cursorX - 150}px top ${
          this.cursorY - 150
        }px`,
        opacity: !this.disabled && this.showCursorGlow ? 1 : 0,
      }
    },
  },
  methods: {
    handleClick(event: MouseEvent) {
      this.$emit('click', event)
    },
    handleMouseEnter() {
      this.showCursorGlow = true
    },
    handleMouseLeave() {
      this.showCursorGlow = false
    },
    handleMouseMove(e: MouseEvent) {
      const button = this.$refs.button as HTMLElement
      if (!button) {
        return
      }
      const bounds = button.getBoundingClientRect()
      this.cursorX = e.clientX - bounds.left
      this.cursorY = e.clientY - bounds.top
    },
  },
})
</script>
<style scoped lang="less" src="./Button.less"></style>
