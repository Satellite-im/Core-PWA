<template src="./Glyph.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { Glyphs, Pack } from '~~/libraries/glyphs'
import { MessageGlyph } from '~/libraries/Iridium/chat/types'
import { RootState } from '~~/types/store/store'

export default Vue.extend({
  props: {
    glyph: {
      type: Object as PropType<MessageGlyph>,
      required: true,
    },
    failed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
    }),
    src(): string {
      return this.glyph.src.replace('$1', 'small')
    },
    pack(): Pack | undefined {
      const p = Object.values(Glyphs).find(
        (pack) => pack.id === this.glyph.packId,
      )
      return p
    },
  },
  methods: {
    openModal() {
      if (!this.pack) {
        return
      }
      this.$store.commit('ui/toggleModal', {
        name: 'glyph',
        state: !this.ui.modals.glyph,
      })
      this.$store.commit('ui/setGlyphModalPackId', this.pack.id)
    },
  },
})
</script>

<style scoped lang="less" src="./Glyph.less"></style>
