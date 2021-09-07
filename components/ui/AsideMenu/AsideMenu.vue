<template src="./AsideMenu.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SidebarGrouping } from '~/types/ui/sidebar'

export default Vue.extend({
  props: {
    /**
     * Set the active route
     */
    active: {
      type: String,
      default: '',
    },
    /**
     * Should we include the aside menu toggle icon
     */
    toggleable: Boolean,
    /**
     * Callable method or function emitted when the menu is toggled
     */
    toggle: {
      type: Function,
      default: () => {},
    },
    /**
     * Optional title to the sidebar menu
     */
    title: {
      type: String,
      default: 'Title',
    },
    /**
     * List of sidebar content
     */
    menuContent: {
      type: Array as PropType<Array<SidebarGrouping>>,
      default: () => [],
    },
    custom: {
      type: Boolean,
      default: false,
    },
    customAction: {
      type: Function,
      default: () => () => {},
    },
  },
})
</script>

<style scoped lang="less" src="./AsideMenu.less"></style>
