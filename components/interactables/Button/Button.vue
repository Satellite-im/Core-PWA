<template src="./Button.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { ButtonType, ButtonSize, ButtonFonts } from './types'

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
      default: 'normal',
    },
    /**
     * Determines the type of the button
     *
     * @remarks
     * Determines the type of the button. See Bumla.io for available sizes
     */
    type: {
      type: String as PropType<ButtonType>,
      default: 'primary',
    },
    /**
     * Callable function when button is clicked
     *
     * @remarks
     * This should usually be a store mutation or UI change.
     */
    action: {
      type: Function,
      required: false,
      default: () => {},
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
    outlined: {
      type: Boolean,
      default: false,
    },
    /**
     * Add a loading state to the button
     * Useful for buttons that kick off async tasks
     */
    loading: {
      type: Boolean,
      default: false,
    },
    /**
     * This will disable the button
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Make the button take up 100% of the parent container
     */
    fullWidth: {
      type: Boolean,
      default: false,
    },
    /**
     * This will make the button switch font family when needed
     */
    font: {
      type: String as PropType<ButtonFonts>,
      default: 'secondary',
    },
    /**
     * Change html button's type
     */
    htmlType: {
      type: String,
      default: 'button',
    },
  },
})
</script>
<style scoped lang="less" src="./Button.less"></style>
