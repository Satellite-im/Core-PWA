<template src="./AsideMenu.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SidebarGrouping } from '~/types/ui/sidebar'

export default Vue.extend({
  props: {
    active: {
      type: String,
      default: '',
    },
    toggleable: Boolean,
    toggle: {
      type: Function,
      default: () => {},
    },
    title: {
      type: String,
      default: 'Title',
    },
    menuContent: {
      type: Array as PropType<Array<SidebarGrouping>>,
      default: () => [],
    },
  },
})
</script>

<style scoped lang="less" src="./AsideMenu.less"></style>
