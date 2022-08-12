<template src="./Item.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { DownloadIcon, FileIcon } from 'satellite-lucide-icons'
import { MessageAttachment } from '~/libraries/Iridium/chat/types'
import { isMimeEmbeddableImage } from '~/utilities/FileType'

export default Vue.extend({
  components: {
    DownloadIcon,
    FileIcon,
  },
  props: {
    attachment: {
      type: {} as PropType<MessageAttachment>,
      required: true,
    },
  },
  computed: {
    isEmbeddable(): boolean {
      return isMimeEmbeddableImage(this.attachment.type)
    },
  },
  methods: {
    download() {
      const anchor = this.$refs.download as HTMLAnchorElement
      anchor.click()
    },
  },
})
</script>

<style scoped lang="less" src="./Item.less"></style>
