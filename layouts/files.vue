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
          />
        </swiper-slide>
        <swiper-slide class="dynamic-content">
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

import Layout from '~/components/mixins/Layouts/Layout'
import { mobileSwipe } from '~/components/mixins/Swipe/Swipe'

import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'

export default Vue.extend({
  name: 'FilesLayout',
  mixins: [mobileSwipe, Layout],
  middleware: 'authenticated',
  components: {
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
