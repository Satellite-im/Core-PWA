<template src="./Image.html" />
<script lang="ts">
import Vue, { PropType } from 'vue'
import { ImageIcon, DownloadIcon } from 'satellite-lucide-icons'
import { FileMessage, ImageMessage } from '~/types/textile/mailbox'

export default Vue.extend({
  components: {
    ImageIcon,
    DownloadIcon,
  },
  props: {
    alt: {
      type: String,
      default: 'Image',
    },
    full: {
      type: Boolean,
      default: false,
    },
    image: {
      type: Object as PropType<ImageMessage>,
      required: true,
    },
  },
  methods: {
    clickHandler(event: MouseEvent): void {
      this.$store.commit('ui/setChatImageOverlay', this.image)
    },
  },
})
</script>
<style scoped lang="less" src="./Image.less"></style>
