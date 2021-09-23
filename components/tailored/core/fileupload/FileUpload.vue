<template src="./FileUpload.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    type: {
      type: String,
      default: 'quick',
    },
  },
  data() {
    return {
      file: false,
      url: false,
      nsfw: { status: false, checking: false },
    }
  },
  methods: {
    /**
     * Triggered when a file is changed on the input
     */
    /**
     * @method handleFile DocsTODO
     * @description
     * @param event
     * @example
     */
    async handleFile(event: any) {
      this.$data.file = event.target.files[0]
      this.$data.nsfw.checking = true
      this.$data.nsfw.status = await this.$Security.isNSFW(this.$data.file)
      this.$data.nsfw.checking = false
      this.loadPicture(this.$data.file)
    },
    /**
     * Load a picture into a data URL push to data
     */
    /**
     * @method loadPicture DocsTODO
     * @description
     * @param file
     * @example
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
    /**
     * @method isEmbedableImage DocsTODO
     * @description
     * @param filename
     * @returns
     * @example
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
    /**
     * @method cancelUpload DocsTODO
     * @description
     * @example
     */
    cancelUpload() {
      this.$data.file = false
      this.$data.url = false
    },
  },
})
</script>

<style scoped lang="less" src="./FileUpload.less"></style>
