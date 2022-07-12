<template src="./ImageCropper.html" />

<script lang="ts">
import Vue from 'vue'
import VueCroppie from 'vue-croppie'
import 'croppie/croppie.css'

Vue.use(VueCroppie)

export default Vue.extend({
  name: 'ImageCropper',
  props: {
    setCroppedImage: {
      type: Function,
      required: true,
    },
    imageUrl: {
      type: String,
      default: '',
      required: true,
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
      this.$refs?.croppieRef?.result(
        this.$Config.cropperOptions,
        (output: Blob) => {
          this.setCroppedImage(output)
        },
      )

      this.$emit('toggle-cropper')
    },
  },
})
</script>

<style scoped lang="less" src="./ImageCropper.less"></style>
