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
    shopAllGlyphs() {
      this.$store.commit('ui/setGlyphMarketplaceView', {
        view: GlyphMarketViewStatus.SHOP_ALL,
        shopId: null,
      })
    },
    navigateGlyph(type: string) {
      if (type === 'prev') {
        this.featuredIndex = this.featuredIndex > 0 ? this.featuredIndex - 1 : 0
      } else if (
        this.featuredIndex <
        this.$mock.marketplace.marketGlyphs.length - 1
      ) {
        this.featuredIndex++
      }
      this.featuredGlyph =
        this.$mock.marketplace.marketGlyphs[this.featuredIndex]
    },
  },
})
</script>

<style scoped lang="less" src="./Featured.less"></style>
