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
  data() {
    return {
      file: [],
    }
  },
  props: {
    attachment: {
      type: {} as PropType<MessageAttachment>,
      required: true,
    },
  },
  computed: {
    isEmbeddable(): boolean {
      console.log('debug: | isEmbeddable | this.attachment', this.attachment)
      return isMimeEmbeddableImage(this.attachment.type)
    },
  },
  async beforeMount() {
    // if (this.attachment && this.attachment.id) {
    const file = await iridium.connector?.load(this.attachment.id)
    console.log('debug: | beforeMount | file', file)
    // }
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
