<template>
  <InteractablesAsideMenu
    :menu-content="sidebarLayout"
    :title="title"
    :toggle="toggle"
    :active="ui.settingsRoute"
    custom
    :custom-action="customAction"
  />
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SidebarGrouping, SidebarLink } from '~/types/ui/sidebar'
import { SettingsRoutes } from '~/store/ui/types'

export default Vue.extend({
  props: {
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
      sidebarLayout: [
        {
          title: 'General',
          links: [
            {
              to: SettingsRoutes.PERSONALIZE,
              text: 'Personalize',
            },
            /* {
              to: SettingsRoutes.PROFILE,
              text: 'Profile',
            }, */
            {
              to: SettingsRoutes.AUDIO_AND_VIDEO,
              text: 'Audio & Video',
            },
            {
              to: SettingsRoutes.KEY_BINDS,
              text: 'Keybinds',
            },
            {
              to: SettingsRoutes.ACCOUNTS_AND_DEVICES,
              text: 'Accounts & Devices',
            },
            {
              to: SettingsRoutes.PRIVACY,
              text: 'Privacy',
            },
          ] as Array<SidebarLink>,
        } as SidebarGrouping,
        {
          title: 'Realms & Security',
          links: [
            {
              to: SettingsRoutes.REALMS,
              text: 'Realms',
            },
            {
              to: SettingsRoutes.STORAGE,
              text: 'Storage',
            },
            {
              to: SettingsRoutes.NETWORK,
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
            },
            {
              to: 'notifications',
              text: 'Notifications',
            }, */
            {
              to: SettingsRoutes.INFO,
              text: 'App Info',
            },
          ] as Array<SidebarLink>,
        } as SidebarGrouping,
      ],
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    /**
     * @method customAction DocsTODO
     * @description
     * @param link
     * @example
     */
    customAction(link: string) {
      this.$props.handleRouteChange(link)
    },
  },
})
</script>
<style scoped lang="less"></style>
