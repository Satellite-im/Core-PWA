<template src="./Image.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { ImageIcon, DownloadIcon } from 'satellite-lucide-icons'
import { FileMessagePayload } from '../Embeds/File/types'
// @ts-ignore
import placeholderImage from '~/assets/svg/mascot/sad_curious.svg'

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
      type: Object as PropType<FileMessagePayload>,
      required: true,
    },
  },
  data() {
    return {
      placeholderSrc: placeholderImage,
      placeholderText: this.$t('errors.chat.failed_load'),
      usePlaceholder: false,
    }
  },
  methods: {
    clickHandler(event: MouseEvent): void {
      this.$store.commit('ui/setChatImageOverlay', this.image)
    },
    onImageError() {
      this.usePlaceholder = true
    },
  },
})
</script>
<style scoped lang="less" src="./Image.less"></style>
