<template src="./Upload.html"></template>
<script lang="ts">
import { FilePlusIcon, PlusIcon } from 'satellite-lucide-icons'
import Vue, { PropType } from 'vue'
import { mapState } from 'vuex'
import { Config } from '~/config'
import { PropCommonEnum } from '~/libraries/Enums/enums'
import { isHeic } from '~/utilities/FileType'
import { UploadDropItemType } from '~/types/files/file'
import { Friend } from '~/types/ui/friends'
import { SettingsRoutes } from '~/store/ui/types'
import { RootState } from '~/types/store/store'
const converter = require('heic-convert')

export default Vue.extend({
  name: 'Upload',
  components: {
    PlusIcon,
    FilePlusIcon,
  },
  props: {
    type: {
      type: String,
      default: '',
    },
    recipient: {
      type: Object as PropType<Friend>,
      default: null,
    },
    files: {
      type: Array as PropType<UploadDropItemType[]>,
      default: null,
    },
  },
  data() {
    return {
      fileAmount: 0,
    }
  },
  computed: {
    ...mapState({
      consentScan: (state) => (state as RootState).settings.consentScan,
    }),
    activeFriend(): Friend | undefined {
      return this.$Hounddog.getActiveFriend(this.$store.state.friends)
    },
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
      if (!this.consentScan) {
        this.$toast.error(
          this.$t('pages.files.errors.enable_consent') as string,
          {
            duration: 3000,
          },
        )
        this.$store.commit('ui/toggleSettings', {
          show: true,
          defaultRoute: SettingsRoutes.PRIVACY,
        })
        return
      }

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
      if (this.recipient) {
        const newFiles: File[] = [...event.target.files]

        if (newFiles.length + this.files.length > 8) {
          this.$store.commit('chat/setCountError', true)

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
        this.$store.commit('chat/setCountError', false)
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
      }
    },
    /**
     * @method loadPicture
     * @description Creates data URL from file and pushes it to url in the components data object (this.url = the new created data URL)
     * @param file File to load
     * @param callback Function to be called after the data URL is created
     * @example this.loadPicture(this.file)
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
      this.fileAmount--
      if (this.fileAmount === 0) {
        if (this.$store.state.chat.containsNsfw) {
          this.alertNsfwFile()
        }
        if (!this.$store.state.chat.containsNsfw) {
          this.$emit('cancelUpload')
          document.body.style.cursor = PropCommonEnum.DEFAULT
          this.$store.dispatch('textile/clearUploadStatus')
        }
      }
    },
    alertNsfwFile() {
      this.$store.commit('chat/setAlertNsfw', true)

      setTimeout(() => {
        this.$store.commit('chat/setAlertNsfw', false)
        this.$store.commit('chat/setContainsNsfw', false)
        this.$emit('cancelUpload')
        document.body.style.cursor = PropCommonEnum.DEFAULT
        this.$store.dispatch('textile/clearUploadStatus')
      }, 500000)
    },
    /**
     * @method dispatchFile
     * @description Sends a singular file to textile.
     */
    async dispatchFile(file: UploadDropItemType) {
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
          this.$store.commit('chat/setContainsNsfw', true)
          this.alertNsfwFile()
        }
      }
      this.fileAmount = nsfwCheck.length
      for (const file of nsfwCheck) {
        await this.dispatchFile(file)
      }
      this.$store.commit('chat/deleteFiles', this.recipient.address)
    },
  },
})
</script>
<style scoped lang="less" src="./Upload.less"></style>
