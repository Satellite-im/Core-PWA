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
      // TODO: Replace all text entries with i18n
      return [
        {
          title: 'User Settings',
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
        {
          title: 'App Settings',
          links: [
            /* {
              to: SettingsRoutes.REALMS,
              text: 'Realms',
            }, */ // hidden due to AP-2243
            {
              to: SettingsRoutes.STORAGE,
              text: 'Storage',
            },
            /* {
               to: SettingsRoutes.NETWORK,
               text: 'Network',
            }, */
            {
              to: SettingsRoutes.KEY_BINDS,
              text: 'Keybinds',
            },
            {
              to: SettingsRoutes.ACCOUNTS_AND_DEVICES,
              text: 'Accounts & Devices',
            },
            {
              to: SettingsRoutes.PRIVACY_AND_PERMISSIONS,
              text: 'Privacy & Permissions',
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
  background: @semitransparent-dark-gradient;
  display: flex;
  flex-direction: column;
  gap: @normal-spacing;

  .menu-label {
    &:extend(.font-muted);
    font-family: @heading-font;
    font-size: @font-size-sm;
    margin-bottom: 0.25rem;
  }

  .menu-list {
    li {
      @media only screen and (min-width: @small-breakpoint) {
        &:hover {
          &:extend(.background-semitransparent-light);
        }
      }

      a {
        display: block;
        -webkit-user-drag: none;
        text-decoration: none;
        padding: 0.5em 0;
        &:extend(.no-select);
        &:extend(.font-primary);
        &:extend(.round-corners);

        @media only screen and (min-width: @mobile-breakpoint) {
          padding: 0.5em 0.75em;

          &:hover {
            .background-semitransparent-light();
            .font-primary();
          }

          &.active {
            .background-flair-gradient();
            .glow-flair();
          }
        }

        @media only screen and (max-width: @mobile-breakpoint) {
          &:active {
            opacity: 0.5;
          }
        }
      }
    }
  }

  @media only screen and (max-width: @mobile-breakpoint) {
    background: none;
  }
}
</style>
