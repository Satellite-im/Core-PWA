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
    loadPicture: (item: UploadDropItemType, callback: Function) => void
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
    files: {
      type: Array as PropType<UploadDropItemType[]>,
      default: null,
    },
    countError: {
      type: Boolean,
      default: false,
    },
    uploadStatus: {
      type: Boolean,
      default: false,
    },
    cancelUpload: {
      type: Function,
      default: () => {},
    },
    alertNsfw: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      progress: 0,
      ipfsHash: false,
      selectedFile: false,
      imageURL: '',
      fileClass: false,
      error: false,
      aiScanning: false,
      fileAmount: 0,
      containsNsfw: false,
    }
  },
  computed: {
    ...mapState(['ui', 'friends', 'chat']),
    activeFriend() {
      return this.$Hounddog.getActiveFriend(this.$store.state.friends)
    },
  },
  watch: {
    recipient() {
      this.$props.files =
        cloneDeep(this.chat.files?.[this.$props.recipient?.address]) ?? []
      this.$parent.$data.showFilePreview = this.$props.files.length > 0
    },
  },
  mounted() {
    this.$props.files =
      cloneDeep(this.chat.files?.[this.$props.recipient?.address]) ?? []
    this.$parent.$data.showFilePreview = this.$props.files.length > 0
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
        if (newFiles.length + this.$props.files.length > 8) {
          this.$props.countError = true
          return
        }

        const address = this.$props.recipient?.address

        if (
          !address &&
          !RegExp(this.$Config.regex.uuidv4).test(
            this.$props.recipient.textilePubkey.split('|')[1],
          )
        )
          return

        this.$props.countError = false

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

        this.$props.files.push(...filesToUpload)
        this.$props.uploadStatus = true
      }
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
     * @method finishUploads
     * @description Keeps track of how many files have been uploaded
     */
    finishUploads() {
      this.$data.fileAmount--
      if (this.$data.fileAmount === 0) {
        if (this.$data.containsNsfw) {
          this.$props.alertNsfw = true
          this.alertNsfwFile()
        }
        if (!this.$data.containsNsfw) {
          this.$props.cancelUpload()
          document.body.style.cursor = PropCommonEnum.DEFAULT
          this.$store.dispatch('textile/clearUploadStatus')
        }
      }
    },
    alertNsfwFile() {
      this.$props.alertNsfw = true
      setTimeout(() => {
        this.$props.alertNsfw = false
        this.$data.containsNsfw = false
        this.$props.cancelUpload()
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
          this.$props.recipient.textilePubkey.split('|')[1],
        )
      ) {
        await this.$store
          .dispatch('textile/sendGroupFileMessage', {
            groupID: this.$props.recipient?.textilePubkey,
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
            to: this.$props.recipient?.textilePubkey,
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

      for (const file of this.$props.files) {
        if (!file.nsfw.status) {
          nsfwCheck.push(file)
        } else {
          this.$data.containsNsfw = true
          if (this.$props.files.length === 1) {
            this.alertNsfwFile()
          }
        }
      }

      this.$data.fileAmount = nsfwCheck.length

      for (const file of nsfwCheck) {
        await this.dispatchFile(file)
      }

      this.$store.commit('chat/deleteFiles', this.$props.recipient.address)
    },
  },
})
</script>

<style scoped lang="less" src="./Upload.less"></style>
