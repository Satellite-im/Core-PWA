<template src="./Upload.html"></template>

<script lang="ts">
import { FilePlusIcon, PlusIcon, XIcon } from 'satellite-lucide-icons'
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { cloneDeep } from 'lodash'
import { Config } from '~/config'
import { PropCommonEnum } from '~/libraries/Enums/enums'
import { isHeic } from '~/utilities/FileType'
import { UploadDropItemType, FileType } from '~/types/files/file'
import { Friend } from '~/types/ui/friends'
const converter = require('heic-convert')

declare module 'vue/types/vue' {
  interface Vue {
    files: UploadDropItemType[]
    uploadStatus: boolean
    count_error: boolean
    loadPicture: (item: UploadDropItemType, callback: Function) => void
    cancelUpload: () => void
    finishUploads: () => void
    dispatchFile: (file: UploadDropItemType) => void
    alertNsfwFile: () => void
    resetFileUpload: () => void
  }
}

export default Vue.extend({
  name: 'Upload',
  components: {
    PlusIcon,
    FilePlusIcon,
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
      default: null,
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
      fileAmount: 0,
      containsNsfw: false,
      alertNsfw: false,
    }
  },
  computed: {
    ...mapState(['ui', 'friends', 'chat', 'textile']),
    activeFriend() {
      return this.$Hounddog.getActiveFriend(this.$store.state.friends)
    },
  },
  watch: {
    recipient() {
      this.files = cloneDeep(this.chat.files?.[this.recipient?.address]) ?? []
      this.$parent.$data.showFilePreview = this.files.length > 0
    },
  },
  mounted() {
    this.files = cloneDeep(this.chat.files?.[this.recipient?.address]) ?? []
    this.$parent.$data.showFilePreview = this.files.length > 0
  },
  methods: {
    /**
     * @method resetFileUpload
     * @description Clear the value of file input so trigger the handleFile for the same file.
     * @example <input @onclick="resetFileUpload" />
     */
    async resetFileUpload() {
      if (this.$refs.quickUpload)
        (this.$refs.quickUpload as HTMLFormElement).value = ''
    },
    handleFileClick() {
      this.resetFileUpload()

      setTimeout(() => {
        if (this.$refs.quickUpload)
          (this.$refs.quickUpload as HTMLFormElement).click()
      }, 200)
    },
    /**
     * @method handleFile
     * @description Handles file in event object by NSFW checking and then loading it. Triggered when a file is changed on the input.
     * @param event Input event object
     * @example <input @change="handleFile" />
     */
    async handleFile(event: any) {
      this.$store.dispatch('textile/clearUploadStatus')
      this.$store.dispatch('ui/setChatbarFocus')

      if (this.editable) {
        const newFiles: File[] = [...event.target.files]
        this.$parent.$data.showFilePreview = newFiles.length > 0
        if (newFiles.length + this.$data.files.length > 8) {
          this.count_error = true
          return
        }

        const address = this.recipient?.address

        if (
          !address &&
          !RegExp(this.$Config.regex.uuidv4).test(
            this.recipient.textilePubkey.split('|')[1],
          )
        )
          return

        this.count_error = false

        for (let i = 0; i < newFiles.length; i++) {
          if (await isHeic(newFiles[i])) {
            const buffer = new Uint8Array(await newFiles[i].arrayBuffer())
            const oBuffer = await converter({
              buffer,
              format: 'PNG', // output format
              quality: 1,
            })
            newFiles[i] = new File(
              [oBuffer.buffer],
              `${newFiles[i].name.split('.')[0] || 'newImage'}.png`,
              {
                type: 'image/png',
              },
            )
          }
        }
        const filesToUpload = await Promise.all(
          newFiles.map(async (file: File) => {
            const result: UploadDropItemType = {
              file,
              nsfw: { status: false, checking: false },
              url: '',
            }

            return result
          }),
        )

        for (const uploadFile of filesToUpload) {
          if (uploadFile.file.size <= Config.nsfwPictureLimit) {
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
          this.loadPicture(uploadFile, () =>
            this.$store.commit('chat/addFile', {
              file: uploadFile,
              address,
            }),
          )
        }

        this.files.push(...filesToUpload)
        this.$data.uploadStatus = true
      }
    },
    handleTouchPreview(event: Event) {
      event.stopPropagation()
    },
    /**
     * @method loadPicture
     * @description Creates data URL from file and pushes it to url in the components data object (this.$data.url = the new created data URL)
     * @param file File to load
     * @param callback Function to be called after the data URL is created
     * @example this.loadPicture(this.$data.file)
     */
    loadPicture(item: UploadDropItemType, callback: Function) {
      if (!item.file) return
      const reader = new FileReader()
      reader.onload = (e: Event | any) => {
        if (e.target) {
          item.url = e.target.result
          if (callback) callback()
        }
      }
      reader.readAsDataURL(item.file)
    },
    /**
     * @method cancelUpload
     * @description Cancels file upload by setting file and url in local data to false
     * TODO: Clear input field, this currently breaks when you upload the same file after cancelling //AP-401
     * @example @click="cancelUpload"
     */
    cancelUpload() {
      this.files = []
      document.body.style.cursor = PropCommonEnum.DEFAULT
      this.uploadStatus = false
      this.count_error = false
      this.$parent.$data.showFilePreview = false
    },
    removeUploadItem(index: number) {
      this.files.splice(index, 1)
      if (this.$data.files.length === 0) {
        document.body.style.cursor = PropCommonEnum.DEFAULT
        this.uploadStatus = false
        this.count_error = false
        this.$parent.$data.showFilePreview = false
        this.$store.commit('chat/deleteFiles', this.recipient.address)
        this.$store.dispatch('textile/clearUploadStatus')
        if (this.textile.messageLoading)
          this.$store.commit('textile/setMessageLoading', { loading: false })
        return
      }
      this.$store.commit('chat/setFiles', {
        files: this.files,
        address: this.recipient.address,
      })
    },
    closeNsfwAlert() {
      this.$data.alertNsfw = false
      this.cancelUpload()
    },
    /**
     * @method finishUploads
     * @description Keeps track of how many files have been uploaded
     */
    finishUploads() {
      this.$data.fileAmount--
      if (this.$data.fileAmount === 0) {
        if (this.$data.containsNsfw) {
          this.$data.alertNsfw = true
          this.alertNsfwFile()
        }
        if (!this.$data.containsNsfw) {
          this.cancelUpload()
          document.body.style.cursor = PropCommonEnum.DEFAULT
          this.$store.dispatch('textile/clearUploadStatus')
        }
      }
    },
    alertNsfwFile() {
      this.$data.alertNsfw = true
      setTimeout(() => {
        this.$data.alertNsfw = false
        this.$data.containsNsfw = false
        this.cancelUpload()
        document.body.style.cursor = PropCommonEnum.DEFAULT
        this.$store.dispatch('textile/clearUploadStatus')
      }, 5000)
    },
    /**
     * @method dispatchFile
     * @description Sends a singular file to textile.
     */
    async dispatchFile(file: FileType) {
      if (
        RegExp(this.$Config.regex.uuidv4).test(
          this.recipient.textilePubkey.split('|')[1],
        )
      ) {
        await this.$store
          .dispatch('textile/sendGroupFileMessage', {
            groupID: this.recipient?.textilePubkey,
            file,
          })
          .then(() => {
            this.finishUploads()
          })
          .catch((error) => {
            if (error) {
              this.$Logger.log('file send error', error)
              document.body.style.cursor = PropCommonEnum.DEFAULT
              this.$store.dispatch('textile/clearUploadStatus')
            }
          })
      } else {
        await this.$store
          .dispatch('textile/sendFileMessage', {
            to: this.recipient?.textilePubkey,
            file,
          })
          .then(() => {
            this.finishUploads()
          })
          .catch((error) => {
            if (error) {
              this.$Logger.log('file send error', error)
              document.body.style.cursor = PropCommonEnum.DEFAULT
              this.$store.dispatch('textile/clearUploadStatus')
            }
          })
      }
    },
    /**
     * @method sendMessage
     * @description Sends action to Upload the file to textile.
     */
    async sendMessage() {
      const nsfwCheck: UploadDropItemType[] = []

      for (const file of this.files) {
        if (!file.nsfw.status) {
          nsfwCheck.push(file)
        } else {
          this.$data.containsNsfw = true
          if (this.$data.files.length === 1) {
            this.alertNsfwFile()
          }
        }
      }

      this.$data.fileAmount = nsfwCheck.length

      for (const file of nsfwCheck) {
        await this.dispatchFile(file)
      }

      this.$store.commit('chat/deleteFiles', this.recipient.address)
    },
  },
})
</script>

<style scoped lang="less" src="./Upload.less"></style>
