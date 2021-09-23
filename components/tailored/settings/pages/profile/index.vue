<template src="./Profile.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import ImageCropper from '~/components/tailored/core/imageCropper/ImageCropper.vue'

import { sampleProfileInfo } from '~/mock/profile'

declare module 'vue/types/vue' {
  interface Vue {
    accounts: any
  }
}
export default Vue.extend({
  name: 'ProfileSettings',
  components: {
    ImageCropper,
  },
  layout: 'settings',
  data() {
    return {
      profileInfo: sampleProfileInfo,
      croppedImage: '',
      showPhrase: false,
      showCropper: false,
    }
  },
  computed: {
    ...mapState(['accounts']),
    splitPhrase(): Array<String> {
      return this.accounts.phrase.split(' ')
    },
  },
  methods: {
    /**
     * @method
     * @description
     * @param
     * @returns
     * @example
     */
    togglePhrase() {
      this.$data.showPhrase = !this.$data.showPhrase
    },
    /**
     * @method
     * @description
     * @param
     * @returns
     * @example
     */
    toggleCropper() {
      this.showCropper = !this.showCropper
    },
    /**
     * @method
     * @description
     * @param
     * @returns
     * @example
     */
    openFileDialog() {
      const fileInput = this.$refs.file as HTMLElement
      fileInput.click()
    },
    /**
     * @method
     * @description
     * @param
     * @returns
     * @example
     */
    setCroppedImage(image: any) {
      const fileInput = this.$refs.file as HTMLInputElement
      this.croppedImage = image
      fileInput.value = ''
    },
    /**
     * @method
     * @description
     * @param
     * @returns
     * @example
     */
    selectProfileImage(e: any) {
      if (e.target && e.target.value !== null) {
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return

        const reader = new FileReader()
        reader.onload = (e: any) => {
          this.profileInfo.imageUrl = e.target.result
          e.target.value = ''

          this.toggleCropper()
        }

        reader.readAsDataURL(files[0])
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Profile.less"></style>
