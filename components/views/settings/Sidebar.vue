<template>
  <aside class="menu">
    <div v-for="group in menuOptions" :key="group.title">
      <TypographyText class="menu-label" size="sm" color="dark" font="heading">
        {{ group.title }}
      </TypographyText>
      <ul>
        <li v-for="link in group.links" :key="link.to">
          <button
            :class="{ active: settingsRoute === link.to }"
            @click="navigateTo(link.to)"
          >
            {{ link.text }}
          </button>
        </li>
      </ul>
    </div>
  </aside>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SettingsRoutes } from '~/store/ui/types'
import { RootState } from '~/types/store/store'

type SidebarGrouping = {
  title: string
  links: {
    to: string
    text: string
  }[]
}

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
  background: @semitransparent-dark-gradient;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  .no-select();

  @media only screen and (max-width: @mobile-breakpoint) {
    background: none;
  }

  .menu-label {
    margin-bottom: 0.25rem;
  }

  button {
    padding: 8px 0;
    width: 100%;
    .round-corners();

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
</style>
