<template src="./Popular.html"></template>

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
      popularGlyph: null,
      popularIndex: 1,
    }
  },
  mounted() {
    this.popularGlyph = this.$mock.marketplace.marketGlyphs[this.popularIndex]
  },
  methods: {
    shopGlyph() {
      if (this.popularGlyph) {
        this.$store.commit('setGlyphMarketplaceView', {
          view: GlyphMarketViewStatus.SHOP_DETAIL,
          // @ts-ignore
          shopId: this.popularGlyph.id,
        })
      }
    },
    navigateGlyph(type: string) {
      if (type === 'prev') {
        this.popularIndex = this.popularIndex > 0 ? this.popularIndex - 1 : 0
      } else if (
        this.popularIndex <
        this.$mock.marketplace.marketGlyphs.length - 1
      ) {
        this.popularIndex++
      }
      this.popularGlyph = this.$mock.marketplace.marketGlyphs[this.popularIndex]
    },
  },
})
</script>

<style scoped lang="less" src="./Popular.less"></style>
