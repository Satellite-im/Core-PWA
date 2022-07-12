<template>
  <div
    id="app-wrap"
    :class="[
      `theme-${settings.theme}`,
      showSidebar && swiperSlideIndex == 0 ? 'is-open' : 'is-collapsed',
    ]"
  >
    <div
      id="app"
      :class="[
        showSidebar && swiperSlideIndex == 0 ? 'is-open' : 'is-collapsed',
        $device.isMobile ? 'mobile-app' : 'desktop',
        isBackgroundCall ? 'has-background-call' : '',
      ]"
    >
      <UiGlobal />

      <swiper
        ref="swiper"
        class="swiper"
        :options="{ ...swiperOption, initialSlide: swiperSlideIndex }"
      >
        <swiper-slide class="sidebar-container">
          <Slimbar
            v-if="!$device.isMobile"
            :servers="$mock.servers"
            :open-modal="toggleModal"
          />
          <MobileSidebar
            v-if="$device.isMobile"
            :show-menu="toggleMenu"
            :users="friends.all"
            :groups="$mock.groups"
            :sidebar="showSidebar"
          />
          <Sidebar
            v-if="!$device.isMobile"
            :show-menu="toggleMenu"
            :sidebar="showSidebar"
          />
        </swiper-slide>
        <swiper-slide class="dynamic-content">
          <menu-icon
            v-if="!$device.isMobile"
            class="toggle--sidebar"
            data-cy="toggle-sidebar"
            size="1.2x"
            full-width
            :style="`${!showSidebar ? 'display: block' : 'display: none'}`"
            @click="toggleMenu"
          />
          <Nuxt id="friends" ref="chat" />
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
import { mapState, mapGetters } from 'vuex'
import { MenuIcon } from 'satellite-lucide-icons'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'
import useMeta from '~/components/compositions/useMeta'
import iridium from '~/libraries/Iridium/IridiumManager'
import { flairs, Flair, Settings } from '~/libraries/Iridium/settings/types'

export default Vue.extend({
  name: 'ChatLayout',
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
        resistanceRatio: 0,
        slidesPerView: 'auto',
        noSwiping: !this.$device.isMobile,
        allowTouchMove: !!this.$device.isMobile,
        on: {
          slideChange: () => {
            if (this.$refs.swiper && this.$refs.swiper.$swiper) {
              const activeIndex = this.$refs.swiper.$swiper.activeIndex
              this.$store.commit('ui/setSwiperSlideIndex', activeIndex)

              const newShowSidebar = activeIndex === 0

              // force virtual keyboard hide on mobile when swiper slide change
              if (newShowSidebar) {
                document.activeElement.blur()
              }

              // if slide active index is set as 0, set showSidebar flag true, else set as false
              if (newShowSidebar) {
                this.$store.commit('ui/showSidebar', true)
                return
              }
              this.$store.commit('ui/showSidebar', false)
            }
          },
        },
      },
    }
  },

  computed: {
    flair(): Flair {
      return flairs[((this as any).settings as Settings).flair]
    },
    ...mapState(['friends', 'groups', 'dataState']),
    ...mapGetters('ui', ['showSidebar', 'swiperSlideIndex']),
    ...mapGetters('webrtc', ['isBackgroundCall']),
  },
  watch: {
    showSidebar(newValue, oldValue) {
      if (newValue !== oldValue) {
        newValue
          ? this.$refs.swiper.$swiper.slidePrev()
          : this.$refs.swiper.$swiper.slideNext()
      }
    },
    swiperSlideIndex(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$refs.swiper.$swiper.slideTo(newValue)
      }
    },
  },
  methods: {
    toggleMenu() {
      this.$store.commit('ui/showSidebar', !this.showSidebar)
    },
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
