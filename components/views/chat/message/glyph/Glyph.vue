<template src="./Glyph.html" />
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { getGlyphSource } from '~/utilities/ImageSize'

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
    size: {
      type: Object as PropType<{ width: number; height: number }>,
      required: true,
    },
    sizeType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
    }
  },
  computed: {
    ...mapState(['ui']),
    getSource() {
      return getGlyphSource({ source: this.source, sizeType: this.sizeType })
    },
  },
  methods: {
    openModal() {
      this.$store.commit('ui/toggleModal', {
        name: 'glyph',
        state: !this.ui.modals.glyph,
      })
      this.$store.commit('ui/setGlyphModalPack', this.pack)
    },
    onImageLoad() {
      this.loading = false
    },
  },
})
</script>
<style scoped lang="less" src="./Glyph.less"></style>
