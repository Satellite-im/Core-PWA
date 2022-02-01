<template src="./File.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  LinkIcon,
  HeartIcon,
  FolderIcon,
  FileIcon,
} from 'satellite-lucide-icons'

import { FileType, Folder } from '~/types/files/file'
import { TextileImage } from '~/types/textile/manager'

export default Vue.extend({
  components: {
    LinkIcon,
    HeartIcon,
    FolderIcon,
    FileIcon,
  },
  props: {
    item: {
      type: Object as PropType<FileType | Folder>,
      default: () => {},
    },
    file: {
      type: Object as PropType<TextileImage>,
    },
    handler: {
      type: Function,
      default: () => () => {},
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
     * @method isImage
     * @description Checks if files filetype complies with Satellites accepted image types
     * @param fileType Files MIME type (a.k.a filetype)
     * @returns Boolean based on if the current image complies with Satellites accepted image types
     * @example
     */
    isImage(filetype: string) {
      const acceptableImages = ['image/png', 'image/jpg']
      return acceptableImages.includes(filetype)
    },
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
<style scoped lang="less" src="./File.less"></style>
