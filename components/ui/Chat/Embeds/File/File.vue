<template src="./File.html" />
<script lang="ts">
import Vue, { PropType } from 'vue'
import { DownloadIcon, FileIcon } from 'satellite-lucide-icons'
import { TextileImage } from '~/types/textile/manager'
import { FileMessage } from '~/types/textile/mailbox'

export default Vue.extend({
  components: {
    DownloadIcon,
    FileIcon,
  },
  props: {
    file: {
      type: Object as PropType<FileMessage>,
    },
  },
  data() {
    return {
      fileUrl: String,
      fileSize: '',
    }
  },
  computed: {
    getFileSize() {
      return this.bytesToSize(this.file.size)
    },
  },
  methods: {
    /**
     * @method bytesToSize
     * @description converts bytes to display easily readable file size
     * @param bytes bytes of current file
     * @example bytesToSize(this.file.size)
     */
    bytesToSize(bytes: number) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Bytes'
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`
    },
  },
})
</script>
<style lang="less" scoped src="./File.less"></style>
