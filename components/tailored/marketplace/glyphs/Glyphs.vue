<template src="./Glyphs.html"></template>

<script lang="ts">
import Vue from 'vue'
// @ts-nocheck
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
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('scroll', this.onScroll)
      this.onScroll
    })
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  },
  methods: {
    goBack() {
      this.$store.commit('ui/setGlyphMarketplaceView', {
        view: GlyphMarketViewStatus.HOME,
        shopId: null,
      })
    },
    getGlyphs() {

    },
    onScroll() {
      const glyphs = this.$refs["marketGlyphs"]
      if(glyphs) {
        
        // let marginTop = glyphs.getBoundingClientRect
        // let marginInner = window.innerHeight
        // if((marginTop - marginInner) < -50) {
        //   this.getGlyphs;
        // }
        
      }

    }
  },
})
</script>

<style lang="less" src="./Glyphs.less"></style>
