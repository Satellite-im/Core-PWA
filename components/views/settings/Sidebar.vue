<template>
  <InteractablesAsideMenu
    :menu-content="sidebarLayout"
    :title="title"
    :toggleable="toggleable"
    :toggle="toggle"
    :active="route"
    custom
    :custom-action="customAction"
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
    handleRouteChange: {
      type: Function,
      default: () => () => {},
    },
  },
  data() {
    return {
      route: this.$store.state.ui.settingsRoute,
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
            {
              to: 'privacy',
              text: 'Privacy',
            },
          ] as Array<SidebarLink>,
        } as SidebarGrouping,
        {
          title: 'Realms & Security',
          links: [
            {
              to: 'realms',
              text: 'Realms',
            },
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
            /* {
              to: 'developer',
              text: 'Mock & Tweak',
            }, */
            {
              to: 'notifications',
              text: 'Notifications',
            },
            {
              to: 'info',
              text: 'App Info',
            },
          ] as Array<SidebarLink>,
        } as SidebarGrouping,
      ],
    }
  },
  methods: {
    /**
     * @method customAction DocsTODO
     * @description
     * @param link
     * @example
     */
    customAction(link: string) {
      this.$data.route = link
      this.$props.handleRouteChange(link)
    },
  },
})
</script>
<style scoped lang="less"></style>
