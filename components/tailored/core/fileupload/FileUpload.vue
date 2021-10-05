<template src="./FileUpload.html"></template>

<script lang="ts">
import Vue from 'vue'

// @ts-ignore
import { FileIcon, PlusIcon } from 'vue-feather-icons'

export default Vue.extend({
  components: {
    FileIcon,
    PlusIcon,
  },
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
     * @method handleFile
     * @description Handles file in event object by NSFW checking and then loading it. Triggered when a file is changed on the input.
     * @param event Input event object
     * @example <input @change="handleFile" />
     */
    async handleFile(event: any) {
      this.$data.file = event.target.files[0]
      this.$data.nsfw.checking = true
      this.$data.nsfw.status = await this.$Security.isNSFW(this.$data.file)
      this.$data.nsfw.checking = false
      this.loadPicture(this.$data.file)
    },
    /**
     * @method loadPicture
     * @description Creates data URL from file and pushes it to url in the components data object (this.$data.url = the new created data URL)
     * @param file File to load
     * @example this.loadPicture(this.$data.file)
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
     * @method isEmbedableImage
     * @description Uses Regex to check if a files filename has a valid extension
     * Potential image extensions pulled from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img
     * @param filename A files filename
     * @returns Boolean based on if the filename has a valid extension or not
     * @example v-if="isEmbedableImage(file.name)"
     */
    isEmbedableImage(filename: string): boolean {
      // eslint-disable-next-line prefer-regex-literals
      const imageFormatsRegex = new RegExp(
        '^.*.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|svg|webp)$'
      )
      return imageFormatsRegex.test(filename.toLowerCase())
    },
    /**
     * @method cancelUpload
     * @description Cancels file upload by setting file and url in local data to false
     * TODO: Clear input field, this currently breaks when you upload the same file after cancelling
     * @example @click="cancelUpload"
     */
    cancelUpload() {
      this.$data.file = false
      this.$data.url = false
    },
  },
})
</script>

<style scoped lang="less" src="./FileUpload.less"></style>
