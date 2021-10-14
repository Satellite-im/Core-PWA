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
    handler: {
      type: Function,
      default: () => () => {},
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
  },
})
</script>
<style scoped lang="less" src="./File.less"></style>
