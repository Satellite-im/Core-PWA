<template src="./Glyph.html" />
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'

import { getGlyphSource } from '~/utilities/ImageSize'

export default Vue.extend({
  props: {
    message: {
      type: Object as PropType<any>,
      required: true,
    },
    pack: {
      type: String,
      default: '',
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
      return getGlyphSource({
        source: this.message.src,
        sizeType: this.sizeType,
      })
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
