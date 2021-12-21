<template>
  <div id="app-wrap" :class="sidebar ? 'is-open' : 'is-collapsed'">
    <div
      id="app"
      :class="[
        sidebar ? 'is-open' : 'is-collapsed',
        $device.isMobile ? 'mobile-app' : 'desktop',
      ]"
    >
      <UiGlobal />

      <swiper class="swiper" :options="swiperOption" ref="swiper">
        <swiper-slide class="sidebar-container">
          <Slimbar
            :servers="$mock.servers"
            :unreads="$mock.unreads"
            :open-modal="toggleModal"
          />
          <Sidebar
            :showMenu="toggleMenu"
            :users="friends.all"
            :groups="$mock.groups"
            :sidebar="sidebar"
          />
        </swiper-slide>
        <swiper-slide class="dynamic-content">
          <menu-icon
            class="toggle--sidebar"
            v-on:click="toggleMenu"
            size="1.2x"
            full-width
            :style="`${!sidebar ? 'display: block' : 'display: none'}`"
          />
          <Nuxt id="files" ref="files" />
        </swiper-slide>
      </swiper>
    </div>
    <MobileNav v-if="$device.isMobile" />
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

import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default Vue.extend({
  name: 'FilesLayout',
  mixins: [Touch, Layout],
  middleware: 'authenticated',
  components: {
    MenuIcon,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      sidebar: true,
      swiperOption: {
        initialSlide: 0,
        resistanceRatio: 0,
        slidesPerView: 'auto',
        on: {
          slideChange: () => {
            console.log('slideChange: ', this.swiper)
            this.$data.sidebar = this.$refs.swiper.$swiper.activeIndex === 0
          }
        }
      },
    }
  },
  computed: {
    ...mapState(['friends']),
    swiper() {
      console.log('com swiper: ')
      return this.$refs.swiper.$swiper
    },
  },
  methods: {
    toggleMenu() {
      if(this.$refs.swiper.$swiper) {
        this.$data.sidebar
          ? this.$refs.swiper.$swiper.slideNext()
          : this.$refs.swiper.$swiper.slidePrev()
      }
    }
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
