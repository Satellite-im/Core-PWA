<template src="./File.html" />
<script lang="ts">
import Vue, { PropType } from 'vue'
import { DownloadIcon, FileIcon } from 'satellite-lucide-icons'
import {TextileImage} from "~/types/textile/manager";

export default Vue.extend({
  components: {
    DownloadIcon,
    FileIcon,
  },
  props: {
    data: {
      type: String,
      default: () => {},
    },
    file: {
      type: Object as PropType< TextileImage>
    },
  },
  data() {
    return {
      fileUrl: String,
      fileSize: '',
    }
  },
  computed: {
    findSize() {
    return this.bytesToSize(this.file.size)
    },
  },
  methods: {
    bytesToSize (bytes: number) {
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
      if (bytes === 0) return '0 Bytes'
      const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
      return `${Math.round(bytes / Math.pow(1024, i), 2)} ${sizes[i]}`
    }
  }
})
</script>
<style lang="less" scoped src="./File.less"></style>
