<template src="./Upload.html"></template>

<script lang="ts">
import {
  FileIcon,
  FilePlusIcon,
  PlusIcon,
  SlashIcon,
  XIcon,
} from 'satellite-lucide-icons'
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { Config } from '~/config'
import { PropCommonEnum } from '~/libraries/Enums/types/prop-common-events'
import { UploadDropItemType } from '~/types/files/file'
import { Friend } from '~/types/ui/friends'

declare module 'vue/types/vue' {
  interface Vue {
    loadPicture: (item: UploadDropItemType) => void
    cancelUpload: () => void
    finishUploads: () => void
    dispatchFile: (file: UploadDropItemType) => void
  }
}

export default Vue.extend({
  name: 'Upload',
  components: {
    FileIcon,
    PlusIcon,
    FilePlusIcon,
    SlashIcon,
    XIcon,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    editable: {
      type: Boolean,
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
      imageURL: '',
      fileClass: false,
      error: false,
      aiScanning: false,
      disabledButton: false,
      fileAmount: 0,
    }
  },
  computed: {
    ...mapState(['ui', 'friends', 'textile']),
    activeFriend() {
      return this.$Hounddog.getActiveFriend(this.$store.state.friends)
    },
    currentProgress() {
      return this.textile.uploadProgress
    },
  },
  methods: {
    /**
     * @method handleFile
     * @description Handles file in event object by NSFW checking and then loading it. Triggered when a file is changed on the input.
     * @param event Input event object
     * @example <input @change="handleFile" />
     */
    async handleFile(event: any) {
      this.$data.disabledButton = false
      this.$store.dispatch('textile/clearUploadStatus')
      if (this.editable) {
        const files: File[] = event.target.files
        this.$parent.$data.showFilePreview = files.length > 0
        if (files.length > 8) {
          this.$data.count_error = true
          return
        }
        this.$data.count_error = false
        this.$data.files = await Promise.all(
          [...files].map(async (file: File) => {
            const uploadFile = {
              file,
              nsfw: { status: false, checking: false },
              url: '',
            } as UploadDropItemType
            return uploadFile
          }),
        )
        this.$data.files.every(async (uploadFile: UploadDropItemType) => {
          if (uploadFile.file.size <= Config.uploadByteLimit) {
            uploadFile.nsfw.checking = true
            try {
              uploadFile.nsfw.status = await this.$Security.isNSFW(
                uploadFile.file,
              )
            } catch (err) {
              uploadFile.nsfw.status = true
              uploadFile.nsfw.checking = false
            }
            uploadFile.nsfw.checking = false
          }

          this.loadPicture(uploadFile)
        })
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
      document.body.style.cursor = PropCommonEnum.DEFAULT
      this.$data.uploadStatus = false
      this.$data.count_error = false
      this.$parent.$data.showFilePreview = false
    },
    removeUploadItem(index: number) {
      this.$data.files.splice(index, 1)
      this.$data.files = [...this.$data.files]
      if (this.$data.files.length === 0) {
        document.body.style.cursor = PropCommonEnum.DEFAULT
        this.$data.uploadStatus = false
        this.$data.count_error = false
        this.$parent.$data.showFilePreview = false
      }
    },
    /**
     * @method finishUploads
     * @description Keeps track of how many files have been uploaded
     */
    finishUploads() {
      this.$data.fileAmount--
      if (this.$data.fileAmount === 0) {
        this.cancelUpload()
        document.body.style.cursor = PropCommonEnum.DEFAULT
        this.$store.dispatch('textile/clearUploadStatus')
        this.$data.disabledButton = false
      }
    },
    /**
     * @method dispatchFile
     * @description Sends a singular file to textile.
     */
    // dispatchFile(file: FileType){
    //   this.$store.dispatch('textile/sendFileMessage', {
    //     to: this.recipient.textilePubkey,
    //     file: file,
    //   }).then( () =>
    //     this.finishUploads())
    // },
    /**
     * @method sendMessage
     * @description Sends action to Upload the file to textile.
     */
    async sendMessage () {
      this.disabledButton = true;

      const nsfwCheck = this.$data.files.filter((file: UploadDropItemType) => {
        if (!file.nsfw.status) {
          return file
        }
      })
        nsfwCheck.map((file: UploadDropItemType) => {
          this.fileAmount = nsfwCheck.length
          this.$store.dispatch('textile/sendFileMessage', {
            to: this.recipient.textilePubkey,
            file: file,
          }).then( () =>
            this.finishUploads())
        })

        // }

      console.log(nsfwCheck)
    },
  },
})
</script>

<style scoped lang="less" src="./Upload.less"></style>
