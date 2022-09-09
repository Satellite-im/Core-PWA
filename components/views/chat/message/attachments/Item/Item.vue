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
  computed: {
    isEmbeddable(): boolean {
      return isMimeEmbeddableImage(this.attachment.type)
    },
    subtitle(): string {
      return `${this.$filesize(this.attachment.size)} - ${this.attachment.type}`
    },
  },
  methods: {
    download() {
      iridium.chat.downloadAttachment(this.attachment.cid)
    },
  },
})
</script>

<style scoped lang="less" src="./Item.less"></style>
