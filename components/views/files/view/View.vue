<template src="./View.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import {
  FileIcon,
  DownloadIcon,
  SlashIcon,
  ArchiveIcon,
  XIcon,
  LinkIcon,
} from 'satellite-lucide-icons'
import { FileType } from '~/types/files/file'

export default Vue.extend({
  components: {
    FileIcon,
    DownloadIcon,
    SlashIcon,
    ArchiveIcon,
    XIcon,
    LinkIcon,
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
    /**
     * @method open DocsTODO
     * @description
     * @param location
     * @returns
     * @example
     */
    open(location: string): void {
      window.open(location)
    },
  },
})
</script>
<style scoped lang="less" src="./View.less"></style>
