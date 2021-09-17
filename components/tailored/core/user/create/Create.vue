<template src="./Create.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import ImageCropper from '~/components/tailored/core/imageCropper/ImageCropper.vue'
import { UserRegistrationData } from '~/types/ui/user'

export default Vue.extend({
  name: 'CreateUser',
  components: {
    ImageCropper,
  },
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
  methods: {
    toggleCropper() {
      this.showCropper = !this.showCropper
    },

    selectImage(e: Event) {
      const target = e.target as HTMLInputElement
      if (target.value === null) return

      const files = target.files
      if (!files?.length) return

      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          this.imageUrl = e.target.result.toString()

          this.toggleCropper()
        }
      }

      reader.readAsDataURL(files[0])
    },

    setCroppedImage(image: string) {
      this.croppedImage = image

      const fileInputRef = this.$refs.file as HTMLInputElement

      if (fileInputRef) {
        fileInputRef.value = ''
      }
    },

    confirm() {
      if (this.name.length < 5) {
        this.error = 'Username name must be at least 5 characters.'
        return false
      }
      this.error = ''

      this.onConfirm({
        username: this.name,
        imageURI: this.croppedImage,
        status: this.status,
      })
      return true
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Create.less"></style>
