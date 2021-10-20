<template src="./Detail.html"></template>

<script lang="ts">
import Vue from 'vue'
// @ts-nocheck
import { mapState } from 'vuex'
import { ChevronLeftIcon, HeartIcon } from 'satellite-lucide-icons'

import { marketGlyphs } from '~/mock/marketplace'
import { GlyphShopItem } from '~/types/marketplace/marketplace'

export default Vue.extend({
  components: {
    ChevronLeftIcon,
    HeartIcon,
  },
  props: {},
  data() {
    return {
      marketGlyphs,
      glyphDetail: null,
    }
  },
  computed: {
    ...mapState(['ui']),
  },
  mounted() {
    if (this.ui.glyphMarketplaceView.shopId) {
      // @ts-ignore
      this.glyphDetail = this.marketGlyphs.find(
        (elm: GlyphShopItem) => elm.id === this.ui.glyphMarketplaceView.shopId
      )
    }
  },
})
</script>

<style scoped lang="less" src="./Detail.less"></style>
