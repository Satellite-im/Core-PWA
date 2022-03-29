<template src="./File.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { DownloadIcon, FileIcon } from 'satellite-lucide-icons'
import { isEmbeddableImage } from '~/utilities/FileType'
import { FileMessagePayload } from '~/types/files/file'

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
  data() {
    return { embeddable: false as boolean }
  },
  computed: {
    getFileSize(): string {
      return this.$filesize(this.file.size)
    },
  },
  async mounted() {
    this.embeddable = await this.isEmbeddable()
  },
  methods: {
    async isEmbeddable() {
      const data = await fetch(this.file.url)
      const blob = await data.blob()
      return isEmbeddableImage(blob)
    },
  },
})
</script>
<style lang="less" scoped src="./File.less"></style>
