<template>
  <div
    id="app-wrap"
    :class="`${sidebar ? 'is-open' : 'is-collapsed'} ${
      $store.state.ui.theme.base.class
    }`"
  >
    <div
      id="app"
      :class="`${$store.state.ui.theme.base.class}
      ${sidebar ? 'is-open' : 'is-collapsed'} ${
        $device.isMobile ? 'mobile-app' : 'desktop'
      }`"
    >
      <UiGlobal />

      <swiper class="swiper" :options="swiperOption" ref="swiper">
        <swiper-slide class="sidebar-container">
          <Slimbar
            v-if="!$device.isMobile"
            :servers="$mock.servers"
            :unreads="$mock.unreads"
            :open-modal="toggleModal"
          />
          <ServerSidebar
            :toggle="() => ($data.sidebar = !$data.sidebar)"
            :showMenu="toggleMenu"
            :sidebar="sidebar"
          />
          <Enhancers />
        </swiper-slide>
        <swiper-slide :class="`dynamic-content ${ui.fullscreen ? 'fullscreen-media' : ''}`">
          <menu-icon
            class="toggle--sidebar"
            v-on:click="toggleMenu"
            size="1.2x"
            full-width
            :style="`${!sidebar ? 'display: block' : 'display: none'}`"
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
            :prevent-scroll-offset="500"
            :class="media.activeCall ? 'media-open' : ''"
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
      :root { --flair-color: {{ $store.state.ui.theme.flair.value }}; }
    </v-style>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'

import {
  MenuIcon,
} from 'satellite-lucide-icons'

export default Vue.extend({
  name: 'ServerLayout',
  mixins: [Touch, Layout],
  middleware: 'authenticated',
  components: {
    MenuIcon,
  },
  data() {
    return {
      sidebar: this.$device.isMobile ? false : true,
      swiperOption: {
        initialSlide: this.$device.isMobile ? 1 : 0,
        resistanceRatio: 0,
        slidesPerView: 'auto',
        noSwiping: this.$device.isMobile ? false : true,
        allowTouchMove: this.$device.isMobile ? true : false,
        on: {
          slideChange: () => {
            if (this.$refs.swiper && this.$refs.swiper.$swiper) {
              this.$data.sidebar = this.$refs.swiper.$swiper.activeIndex === 0
            }
          }
        }
      },
    }
  },
  computed: {
    ...mapState(['ui', 'media']),
    swiper() {
      return this.$refs.swiper.$swiper
    },
  },
  methods: {
    toggleMenu() {
      if (this.$refs.swiper.$swiper) {
        this.$data.sidebar
          ? this.$refs.swiper.$swiper.slideNext()
          : this.$refs.swiper.$swiper.slidePrev()
      }
    }
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
