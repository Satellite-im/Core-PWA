<template>
  <div ref="swiper" class="chat">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        :class="{ 'disable-swipe': !Boolean($route.params.id) }"
      >
        <SidebarList />
      </div>
      <div class="swiper-slide">
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
import 'swiper/css'
import { Swiper, SwiperOptions } from 'swiper'
import { Conversation } from '~/libraries/Iridium/chat/types'

export default Vue.extend({
  name: 'MobileChat',
  layout: 'mobile',
  data: () => ({
    swiper: undefined as Swiper | undefined,
  }),
  computed: {
    conversationId(): Conversation['id'] {
      return this.$route.params.id
    },
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
            }
            if (activeIndex === 1) {
              this.swiper.allowSlidePrev = true
              this.swiper.allowSlideNext = false
            }
          },
        },
      }
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
  .swiper-slide {
    padding: @normal-spacing;
  }
}
</style>
