<template src="./FileUpload.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      file: false,
      url: false,
    }
  },
  props: {
    type: {
      type: String,
      default: 'quick',
    },
  },
  methods: {
    /**
     * Triggered when a file is changed on the input
     */
    handleFile(event: any) {
      this.$data.file = event.target.files[0]
      this.loadPicture(this.$data.file)
    },
    /**
     * Load a picture into a data URL push to data
     */
    loadPicture(file: File) {
      if (!file) return
      const self = this
      const reader = new FileReader()
      reader.onload = function (e: Event | any) {
        if (e.target) self.$data.url = e.target.result
      }
      reader.readAsDataURL(file)
    },
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
    /**
     * Clear local data
     * TODO: Clear input field, this currently breaks
     * when you upload the same file after cancelling
     */
    cancelUpload() {
      this.$data.file = false
      this.$data.url = false
    },
  },
})
</script>

<style scoped lang="less" src="./FileUpload.less"></style>
