<template src="./Image.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { ImageIcon, DownloadIcon } from 'satellite-lucide-icons'
import placeholderImage from '~/assets/svg/mascot/sad_curious.svg'
import { MessageAttachment } from '~/libraries/Iridium/chat/types'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    ImageIcon,
    DownloadIcon,
  },
  props: {
    attachment: {
      type: Object as PropType<MessageAttachment>,
      required: true,
    },
  },
  data: () => ({
    placeholderSrc: placeholderImage,
    usePlaceholder: false,
    dataURL: '',
  }),
  async mounted() {
    const { fileBuffer } = await iridium.connector?.load(this.attachment.cid)
    const blob = new Blob([fileBuffer], { type: this.attachment.type })
    this.dataURL = URL.createObjectURL(blob)
  },
  beforeDestroy() {
    URL.revokeObjectURL(this.dataURL)
  },
  methods: {
    imageClick() {
      this.$store.commit('ui/setChatImageOverlay', {
        ...this.attachment,
        dataURL: this.dataURL,
      })
    },
    onImageError() {
      this.usePlaceholder = true
    },
  },
})
</script>
<style scoped lang="less" src="./Image.less"></style>
