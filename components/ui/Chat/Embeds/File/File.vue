<template src="./File.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { DownloadIcon, FileIcon } from 'satellite-lucide-icons'
import { FileMessagePayload } from './types'
import { isMimeEmbeddableImage } from '~/utilities/FileType'

export default Vue.extend({
  components: {
    DownloadIcon,
    FileIcon,
  },
  props: {
    file: {
      type: Object as PropType<FileMessagePayload>,
      required: true,
    },
  },
  computed: {
    getFileSize(): string {
      return this.$filesize(this.file.size)
    },
    isEmbeddable(): boolean {
      return isMimeEmbeddableImage(this.file.type)
    },
    fileDescription(): string {
      return this.file.type
        ? `${this.getFileSize} - ${this.file.type}`
        : this.getFileSize
    },
  },
  methods: {
    download() {
      this.$TextileManager.sharedBucket?.pullFile(
        this.file.id,
        this.file.name,
        this.file.size,
      )
    },
  },
})
</script>
<style lang="less" scoped src="./File.less"></style>
