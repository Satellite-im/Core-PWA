<template src="./ImageCropper.html"></template>

<script>
import Vue from 'vue'
import VueCroppie from 'vue-croppie'
import 'croppie/croppie.css'

Vue.use(VueCroppie)

export default Vue.extend({
  data() {
    return {
      selectedImage: false,
    }
  },
  props: {
    setCroppedImage: {
      type: Function,
      default: undefined,
      required: true,
    },
    toggleCropper: {
      type: Function,
      default: undefined,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
      requierd: true,
    },
  },
  mounted() {
    this.$refs.croppieRef.bind({
      url: this.imageUrl,
    })
  },
  methods: {
    crop() {
      // Options can be updated.
      // Current option will return a base64 version of the uploaded image with a size of 600px X 450px.
      let options = {
        type: 'base64',
        size: { width: 600, height: 450 },
        format: 'jpeg',
      }
      this.$refs.croppieRef.result(options, (output) => {
        this.setCroppedImage(output)
      })

      this.toggleCropper()
    },
  },
})
</script>

<style scoped lang="less" src="./ImageCropper.less"></style>
