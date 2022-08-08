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
})
</script>
<style scoped lang="less" src="./Button.less"></style>
