<template src="./File.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  LinkIcon,
  HeartIcon,
  FolderIcon,
  FileIcon,
  // @ts-ignore
} from 'vue-feather-icons'

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
    isImage(filetype: string) {
      const acceptableImages = ['image/png', 'image/jpg']
      return acceptableImages.includes(filetype)
    },
  },
})
</script>
<style scoped lang="less" src="./File.less"></style>
