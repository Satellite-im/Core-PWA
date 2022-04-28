<template src="./PreviewItem.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import {
  FileIcon,
  FilePlusIcon,
  SlashIcon,
  XIcon,
} from 'satellite-lucide-icons'
import { Config } from '~/config'
import { UploadDropItemType } from '~/types/files/file'

export default Vue.extend({
  components: {
    FileIcon,
    FilePlusIcon,
    SlashIcon,
    XIcon,
  },
  props: {
    item: {
      type: Object as PropType<UploadDropItemType>,
      default: () => {},
    },
  },
  computed: {
    ...mapState(['textile']),
    currentProgress() {
      return this.textile.uploadProgress
    },
  },
  methods: {
    /**
     * @method isEmbedableImage
     * @description Uses Regex to check if a files filename has a valid extension
     * Potential image extensions pulled from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img
     * @param filename A files filename
     * @returns Boolean based on if the filename has a valid extension or not
     * @example v-if="isEmbedableImage(file.name)"
     */
    isEmbedableImage(filename: string): boolean {
      if (!filename) return false
      // eslint-disable-next-line prefer-regex-literals
      const imageFormatsRegex = new RegExp(Config.regex.image)
      return imageFormatsRegex.test(filename.toLowerCase())
    },
  },
})
</script>
<style scoped lang="less" src="./PreviewItem.less"></style>
