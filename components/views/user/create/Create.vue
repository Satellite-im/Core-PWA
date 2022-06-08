<template src="./Create.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/types/store/store'
import { isEmbeddableImage, isHeic } from '~/utilities/FileType'
import blobToBase64 from '~/utilities/BlobToBase64'
import { FILE_TYPE } from '~/libraries/Files/types/file'
import { PlatformTypeEnum } from '~/libraries/Enums/enums'
const convert = require('heic-convert')

export default Vue.extend({
  name: 'CreateUser',
  data() {
    return {
      showCropper: false,
      croppedImage: '',
      imageUrl: '',
      name: '',
      error: '',
      status: '',
      isLoading: false,
    }
  },
  computed: {
    ...mapState({
      accountAddress: (state) => (state as RootState).accounts.active,
    }),
    /**
     * @method accountValidLength
     * @description If the account isn't the length specified in the config, this returns False, true if correct length
     * @example this.accountValidLength
     */
    isInvalidName(): boolean {
      return (
        !this.name ||
        this.name.trim().length < this.$Config.account.minLength ||
        this.name.trim().length > this.$Config.account.maxLength
      )
    },
    /**
     * @method acceptableImageFormats
     * @description embeddable types plus HEIC since we can convert
     * ios doesn't support advanced <input> accept
     * @returns {string} comma separated list of types
     */
    acceptableImageFormats(): string {
      return this.$envinfo.currentPlatform === PlatformTypeEnum.IOS
        ? 'image/*'
        : [
            FILE_TYPE.APNG,
            FILE_TYPE.AVIF,
            FILE_TYPE.GIF,
            FILE_TYPE.JPG,
            FILE_TYPE.PNG,
            FILE_TYPE.WEBP,
            FILE_TYPE.SVG,
            FILE_TYPE.HEIC,
            FILE_TYPE.HEIF,
          ].join(',')
    },
  },
  methods: {
    /**
     * @method toggleCropper DocsTODO
     * @description
     * @example
     */
    toggleCropper() {
      this.showCropper = !this.showCropper
    },
    /**
     * @method selectIamge DocsTODO
     * @description
     * @param e
     * @example
     */
    async selectImage(e: Event) {
      this.error = ''
      this.isLoading = true
      const target = e.target as HTMLInputElement

      // make sure there's file data available
      if (target.value === null || !target.files?.length) {
        this.isLoading = false
        return
      }

      // only one file allowed on this upload, this is an easier variable name to deal with
      let file = target.files[0]

      // stop upload if picture is too large for nsfw scan
      if (file.size > this.$Config.nsfwPictureLimit) {
        this.error = this.$t('errors.accounts.file_too_large') as string
        this.isLoading = false
        return
      }

      // if heic, convert and then set file to png version
      if (await isHeic(file)) {
        const buffer = new Uint8Array(await file.arrayBuffer())
        const oBuffer = await convert({
          buffer,
          format: 'PNG', // output format
          quality: 1,
        })
        file = new File([oBuffer.buffer], 'profilePic.png', {
          type: 'image/png',
        })
      }

      // if invalid file type, prevent upload. this needs to be added since safari mobile doesn't fully support <input> accept
      if (!(await isEmbeddableImage(file))) {
        this.error = this.$t('errors.accounts.invalid_file') as string
        this.resetFileInput()
        this.isLoading = false
        return
      }

      // if nsfw, prevent upload
      try {
        if (await this.$Security.isNSFW(file)) {
          this.error = this.$t('errors.chat.contains_nsfw') as string
          this.resetFileInput()
          this.isLoading = false
          return
        }
      } catch (e: any) {
        this.$Logger.log('error', 'file upload error', e)
        this.error = this.$t('errors.accounts.invalid_file') as string
        this.resetFileInput()
        this.isLoading = false
        return
      }

      this.imageUrl = await blobToBase64(file)
      this.toggleCropper()
      this.isLoading = false
    },
    /**
     * @method resetFileInput
     * @description
     * @returns
     * @example
     */
    resetFileInput() {
      const fileInputRef = this.$refs.file as HTMLInputElement

      if (fileInputRef) {
        fileInputRef.value = ''
      }
    },
    /**
     * @method setCroppedImage
     * @description
     * @param image
     * @returns
     * @example
     */
    setCroppedImage(image: string) {
      this.croppedImage = image
      this.resetFileInput()
    },
    /**
     * @method confirm DocsTODO
     * @description Checks to see if the name is min length, and if it is, passes the username, status, and photohash to parent
     * @returns boolean
     * @example this.onConfirm()
     */
    confirm(e: Event) {
      if (this.isLoading) {
        return
      }
      if (this.isInvalidName) {
        this.error = this.$t('user.registration.username_error', {
          min: this.$Config.account.minLength,
          max: this.$Config.account.maxLength,
        }) as string
        return
      }
      e.preventDefault()

      this.error = ''

      this.$emit('confirm', {
        username: this.name,
        photoHash: this.croppedImage,
        status: this.status,
      })
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Create.less"></style>
