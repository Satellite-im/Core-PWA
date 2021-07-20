<template src="./Uploader.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
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
