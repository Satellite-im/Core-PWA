<template src="./FileUpload.html"></template>

<script lang="ts">
import Vue from 'vue'

import {
  FileIcon,
  PlusIcon,
  FilePlusIcon,
  SlashIcon,
} from 'satellite-lucide-icons'

import { UploadDropItemType } from '~/types/files/file'

declare module 'vue/types/vue' {
  interface Vue {
    files: Array<UploadDropItemType>
  }

}
export default Vue.extend({
  components: {
    FileIcon,
    PlusIcon,
    FilePlusIcon,
    SlashIcon,
  },
  props: {
    type: {
      type: String,
      default: 'quick',
    },
  },
  data() {
    return {
      files: [] as Array<UploadDropItemType>,
      uploadStatus: false,
      count_error: false,
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
      const files: File[] = event.target.files
      if(files.length > 4) {
        // @ts-ignore
        this.$data.count_error = true
        return
      }
      this.$data.count_error = false
      this.$data.files = [...files].map((file: File) => {
        return {
          file,
          nsfw: { status: false, checking: false },
          url: ''
        }
      })
      /* nsfw checking after putting all files */
      for (const file of this.$data.files) {
        file.nsfw.checking = true
        file.nsfw.status = await this.$Security.isNSFW(file.file)
        file.nsfw.checking = false
        this.loadPicture(file)
      }
      this.$data.uploadStatus = true
    },
    /**
     * @method loadPicture
     * @description Creates data URL from file and pushes it to url in the components data object (this.$data.url = the new created data URL)
     * @param file File to load
     * @example this.loadPicture(this.$data.file)
     */
    loadPicture(item: UploadDropItemType) {
      if (!item.file) return
      const reader = new FileReader()
      reader.onload = function (e: Event | any) {
        if (e.target) item.url = e.target.result
      }
      reader.readAsDataURL(item.file)
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
      if (!filename) return false
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
      this.$data.files = []
      this.$data.uploadStatus = false
      this.$data.count_error = false
    },
  },
})
</script>

<style scoped lang="less" src="./FileUpload.less"></style>
