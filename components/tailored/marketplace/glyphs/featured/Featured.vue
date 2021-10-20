<template src="./Featured.html"></template>

<script lang="ts">
import Vue from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from 'satellite-lucide-icons'
import { GlyphMarketViewStatus } from '~/store/ui/types'

export default Vue.extend({
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
  },
  data() {
    return {
      featuredGlyph: null,
      featuredIndex: 0,
    }
  },
  mounted() {
    this.featuredGlyph = this.$mock.marketplace.marketGlyphs[this.featuredIndex]
  },
  methods: {
    shopAllStickers() {
      this.$store.commit('setGlyphMarketplaceView', {
        view: GlyphMarketViewStatus.SHOP_ALL,
        shopId: null,
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Featured.less"></style>
