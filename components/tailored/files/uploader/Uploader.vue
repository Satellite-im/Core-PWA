<template src="./Uploader.html"></template>
<script lang="ts">
import Vue from 'vue'

import { FileIcon, SlashIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    FileIcon,
    SlashIcon,
  },
  props: {
    file: {
      type: File,
      default: () => {},
    },
    url: {
      type: String,
      default: '',
    },
    complete: {
      type: Function,
      default: () => () => {},
    },
    cancelUpload: {
      type: Function,
      default: () => () => {},
    },
    inline: {
      type: Boolean,
      default: false,
    },
    nsfw: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: { status: false, checking: false },
    },
  },
  methods: {
    /**
     * Return if a file has an image extension
     * Potential image extensions pulled from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img
     */
    isEmbedableImage(filename: string): boolean {
      // eslint-disable-next-line prefer-regex-literals
      const imageFormatsRegex = new RegExp(
        '^.*.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)$'
      )
      return imageFormatsRegex.test(filename.toLowerCase())
    },
  },
})
</script>
<style scoped lang="less" src="./Uploader.less"></style>
