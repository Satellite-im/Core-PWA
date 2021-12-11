<template src="./Upload.html"></template>

<script lang="ts">
import Vue, {PropType} from 'vue'
import { Config } from '~/config'
import { Buckets, Identity, KeyInfo } from '@textile/hub'

import {
  FileIcon,
  PlusIcon,
  FilePlusIcon,
  SlashIcon,
} from 'satellite-lucide-icons'

import { UploadDropItemType } from '~/types/files/file'
import {Friend} from "~/types/ui/friends";
import {mapState} from "vuex";
import TextileManager from "~/libraries/Textile/TextileManager";
import FileC from "~/libraries/Textile/FileC";
import BucketManager from "~/libraries/Textile/BucketManager";

declare module 'vue/types/vue' {
  interface Vue {
    files: Array<UploadDropItemType>
  }
}
export default Vue.extend({
  name: 'Upload',
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
    editable: {
      type: Boolean
    },
    recipient: {
      type: Object as PropType<Friend>,
    },
  },
  data() {
    return {
      files: [] as Array<UploadDropItemType>,
      uploadStatus: false,
      count_error: false,
      progress: 0,
      ipfsHash: false,
      selectedFile: false,
      imageURL: null,
      fileClass: false,
      error: false,
      aiScanning: false
    }
  },
  computed: {
    ...mapState(['ui', 'friends', 'textile']),
    activeFriend() {
      return this.$Hounddog.getActiveFriend(this.$store.state.friends)
    },
  },
  methods: {
    // sendMessage() {
        // this.$store.dispatch('textile/sendFileMessage', {
        //   to: this.recipient.textilePubkey,
        //   file: this.$data.files[0]
        // }
        // )
      // const messageBox = this.$refs.messageuser as HTMLElement
      // // Clear Chatbar
      // messageBox.innerHTML = ''
      // this.value = ''
    // },
    /**
     * @method handleFile
     * @description Handles file in event object by NSFW checking and then loading it. Triggered when a file is changed on the input.
     * @param event Input event object
     * @example <input @change="handleFile" />
     */
    async handleFile(event: any) {
      if (this.editable) {
        const files: File[] = event.target.files
        if (files.length > 4) {
          // @ts-ignore
          this.$data.count_error = true
          return
        }
        this.$data.count_error = false
        this.$data.files = [...files].map((file: File) => {
          return {
            file,
            nsfw: { status: false, checking: false },
            url: '',
          }
        })
        /* nsfw checking after putting all files */
        for (const file of this.$data.files) {
          // don't check nsfw for large files or webgl runs out of memory
          if (file.file.size > Config.uploadByteLimit) {
            file.nsfw.tooLarge = true
          }
          if (!file.nsfw.tooLarge) {
            file.nsfw.checking = true
            try {
              file.nsfw.status = await this.$Security.isNSFW(file.file)
            } catch (err) {
              file.nsfw.status = true
              file.nsfw.checking = false
              return
            }
            file.nsfw.checking = false
          }
          this.loadPicture(file)
        }
        this.$data.uploadStatus = true
      }
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
      const imageFormatsRegex = new RegExp(Config.regex.image)
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
    /** @method
     * Setter
     * Uploads the file to IPFS. Progress will be updated on the
     * component for tracking in progress bars and watching
     * @name sendToIpfs
     * @argument file the file to be uploaded to IPFS
     */
    async sendMessage () {
      const $TextileManager: TextileManager = Vue.prototype.$TextileManager
      const path = `/uploads/${this.$data.files[0].file.name}`
      console.log(this.$data.files[0].file)
      $TextileManager.bucketManager?.getBucket()
      const result = await $TextileManager.bucketManager?.pushFile(
        this.$data.files[0].file,
        path,
        (progress: number) => {
           progress
        }
      )
      console.log(result)
      this.imageURL = `https://hub.textile.io${result.root}${path}`
      // this.$store.commit('setStatus', 'Uploading file to IPFS')
      // this.ipfsHash = result.root.replace('/ipfs/', '')
      this.fileClass = new FileC(
        this.imageURL,
        this.ipfsHash,
        this.selectedFile
      )
      // Update file index
      $TextileManager.bucketManager?.addToIndex(this.$data.files, result.root, path)

    }
  },
})
</script>

<style scoped lang="less" src="./Upload.less"></style>
