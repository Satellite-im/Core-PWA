<template>
  <aside class="menu">
    <div v-for="group in menuOptions" :key="group.title">
      <p class="menu-label">{{ group.title }}</p>
      <ul class="menu-list">
        <li v-for="link in group.links" :key="link.to">
          <a
            :class="{ active: settingsRoute === link.to }"
            @click="navigateTo(link.to)"
          >
            {{ link.text }}
          </a>
        </li>
      </ul>
    </div>
  </aside>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SidebarGrouping } from '~/types/ui/sidebar'
import { SettingsRoutes } from '~/store/ui/types'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  computed: {
    ...mapState({
      settingsRoute: (state) => (state as RootState).ui.settingsRoute,
    }),
    menuOptions(): SidebarGrouping[] {
      return [
        {
          title: 'General',
          links: [
            {
              to: SettingsRoutes.PERSONALIZE,
              text: 'Personalize',
            },
            {
              to: SettingsRoutes.PROFILE,
              text: 'Profile',
            },
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
          ],
        },
        {
          title: 'Security',
          links: [
            /* {
              to: SettingsRoutes.REALMS,
              text: 'Realms',
            }, */ // hided due to AP-2243
            {
              to: SettingsRoutes.STORAGE,
              text: 'Storage',
            },
            {
              to: SettingsRoutes.NETWORK,
              text: 'Network',
            },
          ],
        },
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
          ],
        },
      ]
    },
  },
  methods: {
    navigateTo(link: string) {
      this.$store.commit('ui/setSettingsRoute', link)
    },
  },
})
</script>
<style scoped lang="less">
.menu {
  overflow-y: auto;
  &:extend(.no-select);
  padding: 16px;

  .menu-label {
    &:extend(.font-muted);
  }

  .menu-list {
    margin-bottom: @normal-spacing;

    li {
      &:hover {
        &:extend(.background-semitransparent-light);
      }
      a {
        display: block;
        padding: 0.5em 0.75em;
        -webkit-user-drag: none;
        &:extend(.no-select);
        &:extend(.font-primary);

        &:hover {
          &:extend(.background-semitransparent-light);
          &:extend(.font-primary);
        }
        &.active {
          &:extend(.background-flair-gradient);
          &:extend(.glow-flair);
        }
      }
    }
  }
}
</style>
