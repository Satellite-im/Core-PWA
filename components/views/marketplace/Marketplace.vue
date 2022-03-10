<template src="./Marketplace.html"></template>

<script lang="ts">
import Vue from 'vue'

import { BoxIcon, LayersIcon, SmileIcon } from 'satellite-lucide-icons'
import { marketCategories } from '~/mock/marketplace'
export default Vue.extend({
  components: {
    BoxIcon,
    LayersIcon,
    SmileIcon,
  },
  props: {
    closeModal: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      subject: 'Glyphs',
      marketCategories,
      swiperOption: {
        initialSlide: this.$device.isMobile ? 1 : 0,
        resistanceRatio: 0,
        slidesPerView: 'auto',
        noSwiping: !this.$device.isMobile,
        allowTouchMove: !!this.$device.isMobile,
      },
    }
  },
  methods: {
    /**
     * @method changeSubject DocsTODO
     * @description
     * @param subject
     * @returns
     * @example
     */
    changeSubject(subject: string) {
      this.subject = subject
    },
  },
})
</script>

<style lang="less" src="./Marketplace.less"></style>
