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
