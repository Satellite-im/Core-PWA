<template src="./Button.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { ButtonType, ButtonSize } from './types.d'
import { Icon } from '@/types/ui/icons'

export default Vue.extend({
  props: {
    /**
     * Determines the size of the button
     *
     * @remarks
     * Determines the size of the button. See Bumla.io for available sizes
     */
    size: {
      type: String as PropType<ButtonSize>,
      default: 'md',
    },
    /**
     * Determines the type of the button
     *
     * @remarks
     * Determines the type of the button. See Bumla.io for available sizes
     */
    color: {
      type: String as PropType<ButtonType>,
      default: '',
    },
    /**
     * Supported fontawesome icon
     * @deprecated provide icons as slot
     * @remarks
     * You must make sure we have imported the icon before using it. See /plugins/fontawesome.ts
     */
    // eslint-disable-next-line vue/require-default-prop
    icon: {
      type: Object as PropType<Icon>,
      required: false,
    },
    /**
     * Button body text
     *
     * @remarks
     * This is the text that will be displayed inside the button.
     */
    text: {
      type: String,
      default: '',
    },
    /**
     * Should this button be outlined
     */
    outlined: Boolean,
    /**
     * Add a loading state to the button
     * Useful for buttons that kick off async tasks
     */
    loading: Boolean,
    /**
     * This will make the button take up 100% of the parent container
     */
    fullWidth: Boolean,
    inactive: Boolean,
    htmlType: {
      type: String,
      default: 'button',
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
    cursorGlowStyle() {
      return {
        backgroundPosition: `left ${this.cursorX - 150}px top ${
          this.cursorY - 150
        }px`,
        opacity: this.showCursorGlow ? 1 : 0,
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
      const bounds = (this.$refs.button as HTMLElement).getBoundingClientRect()
      this.cursorX = e.clientX - bounds.left
      this.cursorY = e.clientY - bounds.top
    },
  },
})
</script>
<style scoped lang="less" src="./Button.less"></style>
