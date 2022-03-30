<template src="./Create.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { UserRegistrationData } from '~/types/ui/user'

export default Vue.extend({
  name: 'CreateUser',
  props: {
    onConfirm: {
      type: Function as PropType<(userData: UserRegistrationData) => void>,
      required: true,
    },
  },
  data() {
    return {
      showCropper: false,
      creating: '',
      croppedImage: '',
      imageUrl: '',
      name: '',
      error: '',
      status: '',
    }
  },
  computed: {
    /**
     * @method accountValidLength
     * @description If the account isn't the length specified in the config, this returns False, true if correct length
     * @example this.accountValidLength
     */
    accountValidLength(): boolean {
      if (this.name.trim().length < this.$Config.account.minimumAccountLength) {
        return false
      }
      return true
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
      const target = e.target as HTMLInputElement

      if (target.value === null) return

      const files = target.files

      if (!files?.length) return

      // stop upload if picture is too large for nsfw scan.
      // Leaving this in place since nsfw profile pictures would be bad
      if (files[0].size > this.$Config.nsfwByteLimit) {
        this.error = this.$t('errors.accounts.file_too_large') as string
        return
      }
      // stop upload if picture is nsfw
      try {
        const nsfw = await this.$Security.isNSFW(files[0])
        if (nsfw) {
          this.error = this.$t('errors.chat.contains_nsfw') as string
          return
        }
      } catch (err: any) {
        this.$Logger.log('error', 'file upload error')
        this.error = this.$t('errors.sign_in.invalid_file') as string
        this.resetFileInput()
        return
      }

      this.error = ''

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          this.imageUrl = e.target.result.toString()

          this.toggleCropper()
        }
      }

      reader.readAsDataURL(files[0])
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
      e.preventDefault()
      if (!this.accountValidLength) {
        this.error = this.$t('user.registration.username_error') as string
        return false
      }
      this.error = ''

      this.onConfirm({
        username: this.name,
        photoHash: this.croppedImage,
        status: this.status,
      })
      return true
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Create.less"></style>
