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
  },
})
</script>

<style scoped lang="less" src="./Popular.less"></style>
