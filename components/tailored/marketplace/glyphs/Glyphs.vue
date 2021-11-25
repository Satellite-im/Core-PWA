<template src="./Glyphs.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ChevronLeftIcon } from 'satellite-lucide-icons'
import { marketGlyphs } from '~/mock/marketplace'
import { GlyphMarketViewStatus } from '~/store/ui/types'

export default Vue.extend({
  components: {
    ChevronLeftIcon,
  },
  props: {},
  data() {
    return {
      marketGlyphs,
    }
  },
  computed: {
    GlyphMarketViewStatus: () => GlyphMarketViewStatus,
    ...mapState(['ui']),
  },
  watch: {
    '$store.state.ui.glyphMarketplaceView'() {
      this.$parent.$el.scrollTop = 0
    },
  },
  methods: {
    goBack() {
      this.$store.commit('ui/setGlyphMarketplaceView', {
        view: GlyphMarketViewStatus.HOME,
        shopId: null,
      })
    },
  },
})
</script>

<style lang="less" src="./Glyphs.less"></style>
