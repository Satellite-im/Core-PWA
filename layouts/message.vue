<template>
  <div
    id="app-wrap"
    :class="`${
      showSidebar && swiperSlideIndex == 0
        ? 'is-open'
        : 'is-collapsed message-page'
    } ${$store.state.ui.theme.base.class}`"
  >
    <div
      id="app"
      :class="`${
        showSidebar && swiperSlideIndex == 0 ? 'is-open' : 'is-collapsed'
      } ${$device.isMobile ? 'mobile-app' : 'desktop'}`"
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
            :unreads="$mock.unreads"
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
            :users="friends.all"
            :groups="$mock.groups"
            :sidebar="showSidebar"
          />
        </swiper-slide>
        <swiper-slide class="dynamic-content">
          <Nuxt id="new-message" ref="message" />
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
import { mapState, mapGetters } from 'vuex'
import { Touch } from '~/components/mixins/Touch'
import Layout from '~/components/mixins/Layouts/Layout'

export default Vue.extend({
  name: 'MessageLayout',
  mixins: [Touch, Layout],
  middleware: 'authenticated',
  data() {
    return {
      sidebar: !this.$device.isMobile,
      swiperOption: {
        // initialSlide: this.$ui.swiperSlideIndex,
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

              // if slide is 0, set showSidebar true
              // reason? some css action is related with showSidebar flag
              if (newShowSidebar) {
                this.$store.commit('ui/showSidebar', true)
              }
            }
          },
        },
      },
    }
  },
  computed: {
    ...mapState(['friends', 'dataState']),
    ...mapGetters('ui', ['showSidebar', 'swiperSlideIndex']),
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
      // if no friends (means user is new account) && mobile,
      // show home screen with 'No friends yet' graphic (active slider index = 0)
      const { friends } = this
      if (friends && friends.all && friends.all.length === 0) {
        return this.$store.commit('ui/showSidebar', true)
      }

      if (this.$device.isMobile && !this.$route.query?.sidebar) {
        return this.$store.commit('ui/showSidebar', false)
      }
      this.$store.commit('ui/showSidebar', true)
    },
  },
})
</script>

<style lang="less" src="./Layout.less"></style>
