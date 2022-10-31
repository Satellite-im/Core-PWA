<template>
  <div ref="swiperRef" class="chat">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        :class="{ 'disable-swipe': !Boolean($route.params.id) }"
      >
        <div class="search-container">
          <InteractablesInput
            v-model="filter"
            class="search"
            type="search"
            :placeholder="$t('ui.search')"
          />
          <button @click="modal.type = ModalTypes.QUICK_CHAT">
            <plus-icon size="1.5x" />
          </button>
        </div>
        <div v-show="$config.feedbackUrl" class="banner-wrapper">
          <UiEarlyAccessBanner />
        </div>
        <SidebarList :filter="filter" />
      </div>
      <div class="swiper-slide">
        <MobileToolbar @slidePrev="swiper?.slidePrev()" />
        <Media v-if="isActiveCall" />
        <Conversation />
        <Chatbar ref="chatbar" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Swiper, SwiperOptions } from 'swiper'
import { PlusIcon } from 'satellite-lucide-icons'
import 'swiper/css'
import { useNuxtApp } from '@nuxt/bridge/dist/runtime/app'
import { swiperOptions, SWIPER_TRANSITION_SPEED } from '~/utilities/swiper'
import { webrtcHooks } from '~/components/compositions/webrtc'
import { modal, ModalTypes } from '~/composables/modal'
export default {
  name: 'MobileChat',
  layout: 'mobile',
}
</script>

<script setup lang="ts">
const { $route, $router, $store } = useNuxtApp()

const swiperRef = ref<HTMLElement>()
const swiper = ref<Swiper>()
const filter = ref<string>('')

const conversationId = computed<string | undefined>(() => {
  return $route.params.id
})

const { isActiveCall } = webrtcHooks(conversationId.value)

const swiperConfig: SwiperOptions = swiperOptions({
  allowSlidePrev: false,
  on: {
    activeIndexChange: ({ activeIndex }) => {
      if (!swiper.value) {
        return
      }
      if (activeIndex === 0) {
        swiper.value.allowSlidePrev = false
        swiper.value.allowSlideNext = true
        isMobileNavVisible.value = true

        setTimeout(() => {
          $router.push({ path: '/mobile/chat' })
        }, SWIPER_TRANSITION_SPEED)
      }
      if (activeIndex === 1) {
        swiper.value.allowSlidePrev = true
        swiper.value.allowSlideNext = false
        isMobileNavVisible.value = false
      }
    },
  },
})

const isMobileNavVisible = computed<boolean>({
  get: () => $store.state.ui.isMobileNavVisible,
  set: (v: boolean) => $store.commit('ui/setIsMobileNavVisible', v),
})

watch(isActiveCall, (val) => val && swiper.value?.slideNext())

// component is remounted anytime the route param changes
onMounted(() => {
  if (!swiperRef.value) {
    return
  }
  swiper.value = new Swiper(swiperRef.value, swiperConfig)
  if ($route.params.id) {
    swiper.value.slideNext()
  }
})

onUnmounted(() => {
  isMobileNavVisible.value = true
})
</script>

<style lang="less" scoped>
.chat {
  display: flex;
  flex: 1;
  min-height: 0;

  .swiper-slide {
    display: flex;
    flex-direction: column;

    .search-container {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;

      .search {
        flex: 1;
      }
      button {
        height: fit-content;
      }
    }
    .banner-wrapper {
      padding: 0 16px 8px;
    }
  }
}
</style>
