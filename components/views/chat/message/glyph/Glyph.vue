<template src="./Glyph.html" />
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  props: {
    source: {
      type: String,
      default: '',
    },
    pack: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    getSource() {
      if (this.source.includes('/$1/')) {
        return this.source.replace('$1', 'small')
      }
      return this.source
    },
    openModal() {
      this.$store.commit('ui/toggleModal', {
        name: 'glyph',
        state: !this.ui.modals.glyph,
      })
      this.$store.commit('ui/setGlyphModalPack', this.pack)
    },
  },
})
</script>
<style scoped lang="less" src="./Glyph.less"></style>
