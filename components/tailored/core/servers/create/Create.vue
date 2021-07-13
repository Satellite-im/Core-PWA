<template src="./Create.html"></template>

<script>
import ImageCropper from '~/components/tailored/core/imageCropper/ImageCropper.vue'

export default {
  name: 'CreateServer',
  components: {
    ImageCropper,
  },
  props: {
    closeModal: {
      type: Function,
      default: undefined,
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
    }
  },
  methods: {
    toggleCropper() {
      this.showCropper = !this.showCropper
    },

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

    setCroppedImage(image) {
      this.croppedImage = image
      this.$refs.file.value = null
    },

    close() {
      this.closeModal()
    },

    confirm() {
      if (this.name < 5) {
        this.error = 'Server name must be at least 5 characters.'
        return false
      }
      this.error = false
      return true
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Create.less"></style>
