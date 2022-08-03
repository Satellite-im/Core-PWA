<template>
  <div ref="swiper" class="chat">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        :class="{ 'disable-swipe': !Boolean($route.params.id) }"
      >
        <div class="search-container">
          <InteractablesInput
            class="search"
            :placeholder="`${$t('ui.search')}...`"
            :delete-icon="true"
            size="small"
            input-kind="text"
            type="dark"
            disabled
          />
          <button v-if="$route.params.id" @click="swiper.slideNext()">
            <menu-icon class="toggle-sidebar" size="1.5x" />
          </button>
        </div>
        <SidebarList class="mobile-list" />
      </div>
      <div class="swiper-slide">
        <MobileToolbar @slidePrev="swiper.slidePrev()" />
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
import { MenuIcon } from 'satellite-lucide-icons'
import { Swiper, SwiperOptions } from 'swiper'
import { RootState } from '~/types/store/store'
import 'swiper/css'

export default Vue.extend({
  name: 'MobileChat',
  components: {
    MenuIcon,
  },
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
    display: flex;
    flex-direction: column;

    .search-container {
      display: flex;
      align-items: center;
      gap: @normal-spacing;
      padding: @normal-spacing @normal-spacing 0;

      .search {
        flex: 1;
      }
      button {
        height: fit-content;
      }
    }
    .mobile-list {
      padding: @normal-spacing;
    }
  }
}
</style>
