<template src="./Header.html"></template>

<script lang="ts">
import Vue from 'vue'
import { ChevronLeftIcon } from 'satellite-lucide-icons'
import { Swiper } from 'swiper/types'

export default Vue.extend({
  components: {
    ChevronLeftIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: undefined,
    },
    showBack: {
      type: Boolean,
      default: undefined,
    },
  },
  data: () => ({
    el: null as Element | null,
  }),
  computed: {
    shouldShowBack(): boolean {
      if (this.showBack !== undefined) {
        return this.showBack
      }
      if (!this.swiper) {
        return false
      }
      const slide = this.el?.closest('.swiper-slide')
      if (!slide) {
        return false
      }
      const children = slide.parentElement?.children
      if (!children) {
        return false
      }
      return Array.from(children).indexOf(slide) !== 0
    },
    swiper(): Swiper | null {
      const el = this.el?.closest('.swiper-horizontal') as any
      return el?.swiper as Swiper | null
    },
  },
  mounted() {
    this.el = this.$el
  },
  methods: {
    goBack() {
      if (!this.swiper) {
        return
      }
      this.swiper.slidePrev()
    },
  },
})
</script>

<style scoped lang="less" src="./Header.less"></style>
