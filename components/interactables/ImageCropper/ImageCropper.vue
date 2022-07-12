<template src="./ImageCropper.html" />

<script>
import Vue from 'vue'
import VueCroppie from 'vue-croppie'
import 'croppie/croppie.css'

Vue.use(VueCroppie)

export default Vue.extend({
  name: 'ImageCropper',
  props: {
    imageUrl: {
      type: String,
      default: '',
      requierd: true,
    },
  },
  data() {
    return {
      selectedImage: false,
    }
  },
  mounted() {
    this.$refs.croppieRef.bind({
      url: this.imageUrl,
    })
  },
  methods: {
    /**
     * @method crop DocsTODO
     * @description
     * @example
     */
    crop() {
      // Options can be updated.
      // Current option will return a base64 version of the uploaded image with a size of 600px X 450px.
      this.$refs.croppieRef.result(this.$Config.cropperOptions, (output) => {
        this.$emit('set-cropped-image', output)
      })

      this.$emit('toggle-cropper')
    },
  },
})
</script>

<style scoped lang="less" src="./ImageCropper.less"></style>
