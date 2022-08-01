<template>
  <div ref="swiper" class="chat">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide list-slide"
        :class="{ 'disable-swipe': !Boolean($route.params.id) }"
      >
        <SidebarList />
      </div>
      <div class="swiper-slide chat-slide">
        <Toolbar />
        <!-- <Media
          v-if="$device.isMobile"
          :users="$mock.callUsers"
          :max-viewable-users="10"
          :fullscreen-max-viewable-users="6"
        /> -->
        <Conversation />
        <Chatbar ref="chatbar" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import 'swiper/css'
import { Swiper, SwiperOptions } from 'swiper'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'MobileChat',
  layout: 'mobile',
  data: () => ({
    swiper: undefined as Swiper | undefined,
  }),
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    swiperConfig(): SwiperOptions {
      return {
        noSwipingClass: 'disable-swipe',
        allowSlidePrev: false,
        on: {
          activeIndexChange: ({ activeIndex }) => {
            if (!this.swiper) {
              return
            }
            if (activeIndex === 0) {
              this.swiper.allowSlidePrev = false
              this.swiper.allowSlideNext = true
              this.isMobileNavVisible = true
            }
            if (activeIndex === 1) {
              this.swiper.allowSlidePrev = true
              this.swiper.allowSlideNext = false
              this.isMobileNavVisible = false
            }
          },
        },
      }
    },
    isMobileNavVisible: {
      get(): boolean {
        return this.ui.isMobileNavVisible
      },
      set(value: boolean) {
        this.$store.commit('ui/setIsMobileNavVisible', value)
      },
    },
  },
  // component is remounted anytime the route param changes
  mounted() {
    this.swiper = new Swiper(
      this.$refs.swiper as HTMLElement,
      this.swiperConfig,
    )
    if (this.$route.params.id) {
      this.swiper.slideNext()
    }
  },
})
</script>

<style lang="less" scoped>
.chat {
  display: flex;
  flex: 1;
  overflow: hidden;
  .swiper-slide {
    padding: @normal-spacing;
    overflow-y: scroll;
    &.chat-slide {
      display: flex;
      flex-direction: column;
      #chatbar {
        position: sticky;
        bottom: 0;
      }
    }
  }
}
</style>
