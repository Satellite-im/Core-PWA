<template src="./Profile.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'

import {
  EditIcon,
  UserIcon,
  AlignLeftIcon,
  LaptopIcon,
  InfoIcon,
} from 'satellite-lucide-icons'
import { sampleProfileInfo } from '~/mock/profile'
import { ModalWindows } from '~/store/ui/types'
import { PlatformTypeEnum } from '~/libraries/Enums/enums'
import { FILE_TYPE } from '~/libraries/Files/types/file'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  components: {
    EditIcon,
    UserIcon,
    AlignLeftIcon,
    LaptopIcon,
    InfoIcon,
  },
  layout: 'settings',
  data() {
    return {
      image: '',
      status: '',
      accountUrl: '',
      croppedImage: '',
    }
  },
  computed: {
    ...mapState({
      accounts: (state) => (state as RootState).accounts,
      ui: (state) => (state as RootState).ui,
    }),
    ...mapGetters('textile', ['getInitialized']),
    sampleProfileInfo: () => sampleProfileInfo,
    isSmallScreen(): boolean {
      // @ts-ignore
      if (this.$mq === 'sm' || (this.ui.settingsSideBar && this.$mq === 'md'))
        return true
      return false
    },
    src(): string {
      if (this.croppedImage) {
        return this.croppedImage
      }
      const hash = this.accounts?.details?.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
    showCropper(): boolean {
      return this.ui.modals[ModalWindows.CROP]
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
      this.$store.commit('ui/toggleModal', {
        name: ModalWindows.CROP,
        state: !this.ui.modals[ModalWindows.CROP],
      })
    },
    /**
     * @method openFileDialog DocsTODO
     * @description
     * @example
     */
    openFileDialog() {
      if (!this.getInitialized) return

      const fileInput = this.$refs.file as HTMLElement
      fileInput.click()
    },
    /**
     * @method setCroppedImage DocsTODO
     * @description
     * @param image
     * @example
     */
    setCroppedImage(image: any) {
      const fileInput = this.$refs.file as HTMLInputElement
      this.croppedImage = image
      fileInput.value = ''

      this.$store.dispatch('accounts/updateProfilePhoto', image)
    },
    /**
     * @method selectProfileImage DocsTODO
     * @description
     * @param e
     * @returns
     * @example
     */
    selectProfileImage(e: any) {
      if (e.target && e.target.value !== null) {
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return

        const reader = new FileReader()
        reader.onload = (e: any) => {
          this.image = e.target.result
          e.target.value = ''

          this.toggleCropper()
        }

        reader.readAsDataURL(files[0])
      }
    },
    removeProfileImage() {
      this.croppedImage = ''
      // TODO: Update with IPFS method
      // this.$store.dispatch('accounts/updateProfilePhoto', '')
    },
  },
})
</script>

<style scoped lang="less" src="./Profile.less"></style>
