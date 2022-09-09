<template src="./Item.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DownloadIcon, FileIcon } from 'satellite-lucide-icons'
import { MessageAttachment } from '~/libraries/Iridium/chat/types'
import { isMimeEmbeddableImage } from '~/utilities/FileType'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  components: {
    DownloadIcon,
    FileIcon,
  },
  props: {
    attachment: {
      type: Object as PropType<MessageAttachment>,
      required: true,
    },
  },
  data: () => ({
    dataURL: '',
  }),
  computed: {
    isEmbeddable(): boolean {
      return isMimeEmbeddableImage(this.attachment.type)
    },
    subtitle(): string {
      return `${this.$filesize(this.attachment.size)} - ${this.attachment.type}`
    },
  },
  methods: {
    async download() {
      const anchor = this.$refs.download as HTMLAnchorElement
      const { fileBuffer } = await iridium.connector?.load(this.attachment.cid)
      this.dataURL = URL.createObjectURL(
        new Blob([fileBuffer], { type: this.attachment.type }),
      )
      anchor.href = this.dataURL
      anchor.click()
      URL.revokeObjectURL(this.dataURL)
    },
  },
})
</script>

<style scoped lang="less" src="./Item.less"></style>
