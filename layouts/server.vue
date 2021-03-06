<template>
  <div
    id="app-wrap"
    :class="[`theme-${settings.theme}`, sidebar ? 'is-open' : 'is-collapsed']"
  >
    <div
      id="app"
      :class="[
        `theme-${settings.theme}`,
        sidebar ? 'is-open' : 'is-collapsed',
        $device.isMobile ? 'mobile-app' : 'desktop',
        isBackgroundCall ? 'has-background-call' : '',
      ]"
    >
      <UiGlobal />

      <swiper ref="swiper" class="swiper" :options="swiperOption">
        <swiper-slide class="sidebar-container">
          <Slimbar
            v-if="!$device.isMobile"
            :servers="$mock.servers"
            :open-modal="toggleModal"
          />
          <ServerSidebar
            :toggle="() => ($data.sidebar = !$data.sidebar)"
            :show-menu="toggleMenu"
            :sidebar="sidebar"
          />
          <Enhancers />
        </swiper-slide>
        <swiper-slide
          :class="`dynamic-content ${ui.fullscreen ? 'fullscreen-media' : ''}`"
        >
          <menu-icon
            class="toggle--sidebar"
            size="1.2x"
            full-width
            :style="`${!sidebar ? 'display: block' : 'display: none'}`"
            @click="toggleMenu"
          />
          <Toolbar
            id="toolbar"
            :server="{
              name: 'Test Server',
              address: '0x0',
              desc: 'Just a test server',
            }"
            :user="$mock.users[0]"
          />
          <Media
            :fullscreen="ui.fullscreen"
            :users="$mock.callUsers"
            :max-viewable-users="10"
            :fullscreen-max-viewable-users="20"
          />
          <UiChatScroll
            :contents="ui.messages"
            :prevent-scroll-offset="10"
            :class="
              media.activeCall && media.activeCall.callId ? 'media-open' : ''
            "
            enable-wrap
          >
            <Nuxt />
          </UiChatScroll>
          <Chatbar />
        </swiper-slide>
      </swiper>
    </div>
    <MobileNav v-if="$device.isMobile" />
    <!-- Sets the global css variable for the theme flair color -->
    <v-style>
      :root { --flair-color: {{ flair.primary }}; --flair-color-secondary:
      {{ flair.secondary }}; --flair-color-rgb: {{ flair.primaryRGB }}; }
    </v-style>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { MenuIcon } from 'satellite-lucide-icons'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'
import useMeta from '~/components/compositions/useMeta'
import iridium from '~/libraries/Iridium/IridiumManager'
import { flairs, Flair, Settings } from '~/libraries/Iridium/settings/types'

export default Vue.extend({
  name: 'ServerLayout',
  components: {
    MenuIcon,
  },
  mixins: [Touch, Layout],
  middleware: 'authenticated',
  setup() {
    useMeta()
  },
  data() {
    return {
      sidebar: !this.$device.isMobile,
      settings: iridium.settings.state,
      swiperOption: {
        initialSlide: this.$device.isMobile ? 1 : 0,
        resistanceRatio: 0,
        slidesPerView: 'auto',
        noSwiping: !this.$device.isMobile,
        allowTouchMove: this.$device.isMobile,
        on: {
          slideChange: () => {
            if (this.$refs.swiper && this.$refs.swiper.$swiper) {
              this.$data.sidebar = this.$refs.swiper.$swiper.activeIndex === 0
            }
          },
        },
      },
    }
  },
  computed: {
    ...mapState(['ui', 'media']),
    ...mapGetters('webrtc', ['isBackgroundCall']),
    swiper() {
      return this.$refs.swiper.$swiper
    },
    flair(): Flair {
      return flairs[((this as any).settings as Settings).flair]
    },
  },
  methods: {
    toggleMenu() {
      if (this.$refs.swiper.$swiper) {
        this.$data.sidebar
          ? this.$refs.swiper.$swiper.slideNext()
          : this.$refs.swiper.$swiper.slidePrev()
      }
    },
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
