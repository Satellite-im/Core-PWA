<template>
  <div ref="swiper" class="settings">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        :class="{ 'disable-swipe': !Boolean(settingsRoute) }"
      >
        <TypographyText as="h1">Settings</TypographyText>
        <SettingsSidebar class="sidebar" />
      </div>
      <div
        class="swiper-slide"
        :class="{ profile: settingsRoute === SettingsRoutes.PROFILE }"
      >
        <SettingsPagesPersonalize
          v-if="settingsRoute === SettingsRoutes.PERSONALIZE"
        />
        <SettingsPagesAccounts
          v-if="settingsRoute === SettingsRoutes.ACCOUNTS_AND_DEVICES"
        />
        <SettingsPagesAudio
          v-if="settingsRoute === SettingsRoutes.AUDIO_AND_VIDEO"
        />
        <SettingsPagesDeveloper
          v-if="settingsRoute === SettingsRoutes.DEVELOPER"
        />
        <SettingsPagesInfo v-if="settingsRoute === SettingsRoutes.INFO" />
        <SettingsPagesKeybinds
          v-if="settingsRoute === SettingsRoutes.KEY_BINDS"
        />
        <SettingsPagesNotifications
          v-if="settingsRoute === SettingsRoutes.NOTIFICATIONS"
        />
        <SettingsPagesProfile v-if="settingsRoute === SettingsRoutes.PROFILE" />
        <SettingsPagesStorage v-if="settingsRoute === SettingsRoutes.STORAGE" />
        <!-- <SettingsPagesNetwork v-if="settingsRoute === SettingsRoutes.NETWORK" /> -->
        <SettingsPagesRealms v-if="settingsRoute === SettingsRoutes.REALMS" />
        <SettingsPagesPrivacy
          v-if="settingsRoute === SettingsRoutes.PRIVACY_AND_PERMISSIONS"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Swiper, SwiperOptions } from 'swiper'
import { App } from '@capacitor/app'
import { RootState } from '~/types/store/store'
import 'swiper/css'
import { SettingsRoutes } from '~/store/ui/types'
import { swiperOptions, SWIPER_TRANSITION_SPEED } from '~/utilities/swiper'

export default Vue.extend({
  name: 'MobileSettings',
  layout: 'mobile',
  data: () => ({
    swiper: undefined as Swiper | undefined,
    route: SettingsRoutes.EMPTY,
  }),
  computed: {
    ...mapState({
      settingsRoute: (state) => (state as RootState).ui.settingsRoute,
    }),
    SettingsRoutes: () => SettingsRoutes,
    swiperConfig(): SwiperOptions {
      return swiperOptions({
        allowSlidePrev: false,
        on: {
          slideChangeTransitionEnd: ({ activeIndex }) => {
            if (!this.swiper) {
              return
            }
            if (activeIndex === 0) {
              this.$store.commit('ui/setSettingsRoute', SettingsRoutes.EMPTY)
              this.swiper.allowSlidePrev = false
              this.swiper.allowSlideNext = true
            }
            if (activeIndex === 1) {
              this.swiper.allowSlidePrev = true
              this.swiper.allowSlideNext = false
            }
          },
        },
      })
    },
  },
  watch: {
    settingsRoute(val) {
      if (val) {
        this.swiper?.slideNext()
      } else {
        this.swiper?.slidePrev()
      }
    },
  },
  mounted() {
    this.swiper = new Swiper(
      this.$refs.swiper as HTMLElement,
      this.swiperConfig,
    )
    if (this.settingsRoute) {
      this.swiper.slideNext()
    }
  },
  beforeDestroy() {
    this.$store.commit('ui/setSettingsRoute', SettingsRoutes.EMPTY)
  },
})
</script>

<style lang="less" scoped>
.settings {
  display: flex;
  flex: 1;
  overflow: hidden;

  .swiper-slide {
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 16px;

    &.profile {
      padding: 0;
    }

    .settings-page {
      width: 100%;
    }
  }
}
</style>
