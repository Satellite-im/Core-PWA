<template src="./Button.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { Icon } from '@/types/ui/icons'
import { ButtonType, ButtonSize } from './types.d'

export default Vue.extend({
  props: {
    // Determines the size of the button
    // e.g. small, regular, medium, large..
    size: {
      type: String as PropType<ButtonSize>,
      default: 'normal',
    },
    // Determines the type of the button
    // e.g. primary, default, dark..
    type: {
      type: String as PropType<ButtonType>,
      default: 'primary',
    },
    // Callable function when button is clicked
    action: {
      type: Function,
      required: false,
      default: () => {},
    },
    // Supported fontawesome icon
    // eslint-disable-next-line vue/require-default-prop
    icon: {
      type: Object as PropType<Icon>,
      required: false,
    },
    // Button body text
    text: {
      type: String,
      default: 'Button',
    },
    // Should this button be outlined
    outlined: Boolean,
    // Add a loading state to the button
    // Useful for buttons that kick off async tasks
    loading: Boolean,
    loadingText: {
      type: String,
      default: 'Loading...',
    },
    fullWidth: Boolean,
  },
})
</script>
<style scoped lang="less" src="./Button.less"></style>
