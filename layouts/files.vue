<template>
  <div
    id="app-wrap"
    :class="`${showSidebar ? 'is-open' : 'is-collapsed'} ${
      $store.state.ui.theme.base.class
    }`"
  >
    <div
      id="app"
      :class="[
        showSidebar ? 'is-open' : 'is-collapsed',
        $device.isMobile ? 'mobile-app' : 'desktop',
      ]"
    >
      <UiGlobal />

      <swiper ref="swiper" class="swiper" :options="swiperOption">
        <swiper-slide class="sidebar-container">
          <Slimbar
            v-if="!$device.isMobile"
            :servers="$mock.servers"
            :unreads="friends.all"
            :open-modal="toggleModal"
          />
          <Sidebar
            :users="friends.all"
            :groups="$mock.groups"
            :sidebar="showSidebar"
            :show-menu="toggleMenu"
          />
        </swiper-slide>
        <swiper-slide class="dynamic-content">
          <menu-icon
            class="toggle--sidebar"
            size="1.2x"
            full-width
            :style="`${!showSidebar ? 'display: block' : 'display: none'}`"
            @click="toggleMenu"
          />
          <Nuxt id="files" ref="files" />
        </swiper-slide>
      </swiper>
    </div>
    <MobileNav v-if="$device.isMobile" />
    <!-- Sets the global css variable for the theme flair color -->
    <v-style>
      :root { --flair-color: {{ flairColor }}; --flair-color-rgb:
      {{ flairColorRGB }} }
    </v-style>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { MenuIcon } from 'satellite-lucide-icons'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'
import { hexToRGB } from '~/utilities/Colors'

export default Vue.extend({
  name: 'FilesLayout',
  components: {
    MenuIcon,
  },
  mixins: [Touch, Layout],
  middleware: 'authenticated',
  data() {
    return {
      sidebar: !this.$device.isMobile,
      swiperOption: {
        initialSlide: this.$device.isMobile ? 1 : 0,
        resistanceRatio: 0,
        slidesPerView: 'auto',
        noSwiping: !this.$device.isMobile,
        allowTouchMove: !!this.$device.isMobile,
        on: {
          slideChange: () => {
            if (this.$refs.swiper && this.$refs.swiper.$swiper) {
              const newShowSidebar = this.$refs.swiper.$swiper.activeIndex === 0
              if (this.showSidebar !== newShowSidebar) {
                this.$store.commit('ui/showSidebar', newShowSidebar)
              }
            }
          },
        },
      },
    }
  },
  computed: {
    ...mapState(['friends']),
    ...mapGetters('ui', ['showSidebar']),
    flairColor() {
      return this.$store.state.ui.theme.flair.value
    },
    flairColorRGB() {
      return hexToRGB(this.$store.state.ui.theme.flair.value)
    },
  },
  watch: {
    showSidebar(newValue, oldValue) {
      if (newValue !== oldValue) {
        newValue
          ? this.$refs.swiper.$swiper.slidePrev()
          : this.$refs.swiper.$swiper.slideNext()
      }
    },
    $route() {
      this.showInitialSidebar()
    },
  },
  mounted() {
    this.showInitialSidebar()
  },
  methods: {
    toggleMenu() {
      this.$store.commit('ui/showSidebar', !this.showSidebar)
    },
    showInitialSidebar() {
      if (this.$device.isMobile && !this.$route.query?.sidebar) {
        return this.$store.commit('ui/showSidebar', false)
      }
      this.$store.commit('ui/showSidebar', true)
    },
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
