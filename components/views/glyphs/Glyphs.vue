<template src="./Glyphs.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { shuffle } from 'lodash'
import { ShoppingBagIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'
import { Glyphs } from '~/libraries/glyphs'
import { GlyphMarketViewStatus, ModalWindows } from '~/store/ui/types'
import { Pack } from '~~/types/glyphs'

export default Vue.extend({
  components: {
    ShoppingBagIcon,
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    pack(): Pack | undefined {
      return Object.values(Glyphs).find(
        (pack) => pack.id === this.ui.glyphModalPackId,
      )
    },
    samplePackUrls(): string[] {
      if (!this.pack) {
        return []
      }
      return shuffle(this.pack.urls).slice(1, 4)
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
    },
  },
})
</script>
<style scoped lang="less" src="./Glyphs.less"></style>
