<template src="./Profile.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  EditIcon,
  UserIcon,
  AlignLeftIcon,
  LaptopIcon,
  InfoIcon,
} from 'satellite-lucide-icons'
import { sampleProfileInfo } from '~/mock/profile'
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
      showCropper: false,
    }
  },
  computed: {
    ...mapState({
      accounts: (state) => (state as RootState).accounts,
      ui: (state) => (state as RootState).ui,
    }),
    sampleProfileInfo: () => sampleProfileInfo,
    isSmallScreen(): boolean {
      // @ts-ignore
      return this.$mq === 'sm' || (this.ui.settingsSideBar && this.$mq === 'md')
    },
    src(): string {
      if (this.croppedImage) {
        return this.croppedImage
      }
      const hash = this.accounts?.details?.profilePicture
      return hash ? `${this.$Config.ipfs.gateway}${hash}` : ''
    },
    imageInputRef(): HTMLInputElement {
      return (this.$refs.imageInput as Vue).$refs.imageInput as HTMLInputElement
    },
  },
  beforeDestroy() {
    URL.revokeObjectURL(this.croppedImage)
    URL.revokeObjectURL(this.image)
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
     * @method openFileDialog DocsTODO
     * @description
     * @example
     */
    openFileDialog() {
      this.imageInputRef.click()
    },
    /**
     * @method setCroppedImage DocsTODO
     * @description
     * @param image
     * @example
     */
    setCroppedImage(image: Blob) {
      this.croppedImage = URL.createObjectURL(image)
      this.imageInputRef.value = ''
      const img = new Image()
      img.src = this.croppedImage
      // TODO: Save image with iridium
      // Note: This was used for Solana implementation
      // this.$store.dispatch('accounts/updateProfilePhoto', image)
    },
    /**
     * @method selectProfileImage DocsTODO
     * @description
     * @param e
     * @returns
     * @example
     */
    selectProfileImage(e: Event) {
      const target = e.target as HTMLInputElement
      const file = target.files?.[0]

      if (file) {
        this.image = URL.createObjectURL(file)
        this.toggleCropper()
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
