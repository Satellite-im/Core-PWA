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

declare module 'vue/types/vue' {
  interface Vue {
    iconHover: boolean
  }
}

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
      required: true,
    },
    file: {
      type: Object as PropType<TextileImage>,
      default: () => {},
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
      iconHover: false,
    }
  },
  computed: {
    getSubtext() {
      return this.item.children
        ? this.item.children.length + ' items'
        : this.item.type
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
    isImage(filetype: string): boolean {
      const acceptableImages = ['image/png', 'image/jpg']
      return acceptableImages.includes(filetype)
    },
    /**
     * @method fileClick
     * @description Handle regular file click. avoiding regular behavior(handler) if user clicks heart or link icon
     */
    fileClick() {
      if (this.iconHover) {
        return
      }
      this.handler(this.item)
    },
    /**
     * @method mouseOver
     * @description negate regular click behavior (handler)
     */
    mouseOver() {
      this.iconHover = true
    },
    /**
     * @method mouseLeave
     * @description reinstate regular click behavior (handler)
     */
    mouseLeave() {
      this.iconHover = false
    },
  },
})
</script>
<style scoped lang="less" src="./File.less"></style>
