<template src="./File.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { DownloadIcon, FileIcon } from 'satellite-lucide-icons'
import { FileMessage } from '~/types/textile/mailbox'

export default Vue.extend({
  components: {
    DownloadIcon,
    FileIcon,
  },
  props: {
    file: {
      type: Object as PropType<FileMessage>,
      required: true,
    },
  },
  computed: {
    getFileSize() {
      return this.$filesize(this.file.size)
    },
  },
})
</script>
<style lang="less" scoped src="./File.less"></style>
