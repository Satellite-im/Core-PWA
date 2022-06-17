<template src="./AsideMenu.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { MenuIcon } from 'satellite-lucide-icons'
import { SidebarGrouping } from '~/types/ui/sidebar'

export default Vue.extend({
  components: {
    MenuIcon,
  },
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
  methods: {
    /**
     * @method closeModal DocsTODO
     * @description
     * @example
     */
    closeModal() {
      this.$store.commit('ui/toggleSettings', { show: false })
    },
  },
})
</script>

<style scoped lang="less" src="./AsideMenu.less"></style>
