<template src="./Header.html"></template>

<script lang="ts">
import Vue from 'vue'
import { ChevronLeftIcon } from 'satellite-lucide-icons'
import { useSwiper, useSwiperSlide } from 'swiper/vue'
import { Swiper } from 'swiper/types'

export default Vue.extend({
  components: {
    ChevronLeftIcon,
  },
  methods: {
    goBack() {
      const swiper = (this.$el.closest('.swiper-initialized') as any)
        .swiper as Swiper | null
      if (!swiper) {
        return
      }
      swiper.slidePrev()
    },
  },
})
</script>

<style scoped lang="less" src="./Header.less"></style>
