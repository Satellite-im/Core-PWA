<template src="./File.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  LinkIcon,
  HeartIcon,
  FolderIcon,
  FileIcon,
} from 'satellite-lucide-icons'

import { TextileImage } from '~/types/textile/manager'
import { Item } from '~/libraries/Files/abstracts/Item.abstract'

declare module 'vue/types/vue' {
  interface Vue {
    linkHover: boolean
    heartHover: boolean
    handle: () => void
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
      type: Object as PropType<Item>,
      required: true,
    },
    file: {
      type: Object as PropType<TextileImage>,
      default: () => {},
    },
  },
  data() {
    return {
      fileUrl: String,
      fileSize: '',
      fileHover: false,
      linkHover: false,
      heartHover: false,
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
      if (this.linkHover) {
        this.item.toggleShared()
        return
      }
      if (this.heartHover) {
        this.item.toggleLiked()
        return
      }
      this.$emit('handle', this.item)
    },
  },
})
</script>
<style scoped lang="less" src="./File.less"></style>
