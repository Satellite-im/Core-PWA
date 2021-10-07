<template src="./View.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  FileIcon,
  DownloadIcon,
  SlashIcon,
  ArchiveIcon,
  XIcon,
} from 'satellite-lucide-icons'
import { FileType } from '~/types/files/file'

export default Vue.extend({
  components: {
    FileIcon,
    DownloadIcon,
    SlashIcon,
    ArchiveIcon,
    XIcon,
  },
  props: {
    file: {
      type: Object as PropType<FileType>,
      default: () => {},
    },
    close: {
      type: Function,
      default: () => () => {},
    },
  },
  methods: {
    open(location: string): void {
      window.open(location)
    },
  },
})
</script>
<style scoped lang="less" src="./View.less"></style>
