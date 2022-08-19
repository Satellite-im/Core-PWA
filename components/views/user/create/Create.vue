<template src="./Create.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { RootState } from '~/types/store/store'
import { isEmbeddableImage, isHeic } from '~/utilities/FileType'
const convert = require('heic-convert')

export default Vue.extend({
  data() {
    return {
      showCropper: false,
      croppedImage: '',
      imageUrl: '',
      name: '',
      error: [] as string[],
      status: '',
      isLoading: false,
    }
  },
  computed: {
    ...mapState({
      accountAddress: (state) => (state as RootState).accounts.active,
    }),
    /**
     * @method isInvalidName
     * @description returns boolean based on current name input
     */
    isInvalidName(): boolean {
      return (
        !this.name ||
        this.name.trim().length < this.$Config.account.minLength ||
        this.name.trim().length > this.$Config.account.maxLength
      )
    },
    /**
     * @method isInvalidStatus
     * @description returns boolean based on current status input
     */
    isInvalidStatus(): boolean {
      return this.status.trim().length > this.$Config.account.statusMaxLength
    },
    imageInputRef(): HTMLInputElement {
      return (this.$refs.imageInput as Vue).$refs.imageInput as HTMLInputElement
    },
  },
  beforeDestroy() {
    URL.revokeObjectURL(this.croppedImage)
    URL.revokeObjectURL(this.imageUrl)
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
      this.error = []
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
        this.error.push(this.$t('errors.accounts.file_too_large') as string)
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
        this.error.push(this.$t('errors.accounts.invalid_file') as string)
        this.resetFileInput()
        this.isLoading = false
        return
      }

      // if nsfw, prevent upload
      try {
        if (await this.$Security.isNSFW(file)) {
          this.error.push(this.$t('errors.chat.contains_nsfw') as string)
          this.resetFileInput()
          this.isLoading = false
          return
        }
      } catch (e: any) {
        this.$Logger.log('error', 'file upload error', e)
        this.error.push(this.$t('errors.accounts.invalid_file') as string)
        this.resetFileInput()
        this.isLoading = false
        return
      }

      this.imageUrl = URL.createObjectURL(file)
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
      this.imageInputRef.value = ''
    },
    /**
     * @method setCroppedImage
     * @description
     * @param image
     * @returns
     * @example
     */
    setCroppedImage(image: Blob) {
      this.croppedImage = URL.createObjectURL(image)
      const img = new Image()
      img.src = this.croppedImage
      this.resetFileInput()
      // TODO: Save image with iridium
    },
    /**
     * @method confirm DocsTODO
     * @description Checks to see if the name is min length, and if it is, passes the username, status, and photohash to parent
     * @returns boolean
     * @example this.onConfirm()
     */
    confirm(e: Event) {
      e.preventDefault()
      this.error = []
      if (this.isLoading) {
        return
      }
      if (this.isInvalidName) {
        this.error.push(
          this.$t('user.registration.username_error', {
            min: this.$Config.account.minLength,
            max: this.$Config.account.maxLength,
          }) as string,
        )
      }
      // additional client side validation in case the user inspected and changed maxlength constraint
      if (this.isInvalidStatus) {
        this.error.push(
          this.$t('user.registration.status_error', {
            max: this.$Config.account.statusMaxLength,
          }) as string,
        )
      }
      if (this.error.length) {
        return
      }

      this.$emit('confirm', {
        username: this.name.trim(),
        photoHash: this.croppedImage,
        status: this.status.trim(),
      })
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Create.less"></style>
