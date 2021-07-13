<template>
  <UiAsideMenu
    :menu-content="sidebarLayout"
    :title="title"
    :toggleable="toggleable"
    :toggle="toggle"
    :active="$route.path.split('/')[2]"
  />
</template>
<script lang="ts">
import Vue from 'vue'

import { SidebarGrouping, SidebarLink } from '~/types/ui/sidebar'

export default Vue.extend({
  props: {
    toggleable: Boolean,
    toggle: {
      type: Function,
      default: () => {},
    },
    title: {
      type: String,
      default: 'Title',
    },
  },
  data() {
    return {
      sidebarLayout: [
        {
          title: 'General',
          links: [
            {
              to: 'personalize',
              text: 'Personalize',
            },
            {
              to: 'profile',
              text: 'Profile',
            },
            {
              to: 'audio',
              text: 'Audio & Video',
            },
            {
              to: 'keybinds',
              text: 'Keybinds',
            },
            {
              to: 'accounts',
              text: 'Accounts & Devices',
            },
          ] as Array<SidebarLink>,
        } as SidebarGrouping,
        {
          title: 'Network & Security',
          links: [
            {
              to: 'storage',
              text: 'Storage',
            },
            {
              to: 'network',
              text: 'Network',
            },
          ] as Array<SidebarLink>,
        } as SidebarGrouping,
        {
          title: 'Developer',
          links: [
            {
              to: 'developer',
              text: 'Mock & Tweak',
            },
          ] as Array<SidebarLink>,
        } as SidebarGrouping,
      ],
    }
  },
})
</script>
<style scoped lang="less"></style>
