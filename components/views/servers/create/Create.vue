<template src="./Create.html" />

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'CreateServer',
  data() {
    return {
      showCropper: false,
      creating: '',
      croppedImage: '',
      imageUrl: '',
      name: '',
      error: '',
      friends: [],
    }
  },
  watch: {
    friends(newFriends) {
      this.$Logger.log('Friends Watcher', 'New Friends', newFriends)
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
     * @method selectImage DocsTODO
     * @description
     * @param e
     * @example
     */
    selectImage(e) {
      if (e.target.value !== null) {
        const files = e.target.files || e.dataTransfer.files
        if (!files.length) return

        const reader = new FileReader()
        reader.onload = (e) => {
          this.imageUrl = e.target.result
          e.target.value = ''

          this.toggleCropper()
        }

        reader.readAsDataURL(files[0])
      }
    },
    /**
     * @method setCroppedImage DocsTODO
     * @description
     * @param image
     * @example
     */
    setCroppedImage(image: Blob) {
      this.croppedImage = URL.createObjectURL(image)
      ;(this.$refs.file as HTMLInputElement).value = ''
      const img = new Image()
      img.src = this.croppedImage
      // TODO: Save image with iridium
    },
    /**
     * @method confirm DocsTODO
     * @description
     * @returns
     * @example
     */
    confirm() {
      if (this.name < 5) {
        this.error = this.$t('servers.create.server_name_error') as string
        return false
      }
      this.error = false
      return true
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Create.less"></style>
