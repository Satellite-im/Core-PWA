<template src="./Glyphs.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { findKey, shuffle } from 'lodash'
import { ShoppingBagIcon } from 'satellite-lucide-icons'
// import { marketGlyphs } from '~/mock/marketplace'
import { GlyphMarketViewStatus, ModalWindows } from '~/store/ui/types'

export default Vue.extend({
  components: {
    ShoppingBagIcon,
  },
  computed: {
    ...mapState(['ui']),
    selectedPack() {
      const key = findKey(this.$mock.glyphs, ({ name }) => {
        return name === this.ui.glyphModalPack
      })
      return this.$mock.glyphs[key]
    },
    samplePackUrls() {
      return shuffle(this.selectedPack.stickerURLs).slice(1, 4)
    },
  },
  methods: {
    closeModal() {
      this.$store.commit('ui/toggleModal', {
        name: 'glyph',
        state: !this.ui.modals.glyph,
      })
    },
    openMarketplace() {
      this.closeModal()
      this.$store.commit('ui/toggleModal', {
        name: ModalWindows.CALL_TO_ACTION,
        state: !this.ui.modals[ModalWindows.CALL_TO_ACTION],
      })
      /* refactor - AP-1104
       const marketInfo = find(marketGlyphs, ({ glyph }) => {
         return glyph.name === this.selectedPack.name
       })
       this.$store.commit('ui/setGlyphMarketplaceView', {
         view: GlyphMarketViewStatus.SHOP_DETAIL,
         shopId: marketInfo?.id,
       }) */
    },
  },
})
</script>
<style scoped lang="less" src="./Glyphs.less"></style>
