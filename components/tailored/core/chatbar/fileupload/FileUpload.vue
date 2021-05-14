<template src="./FileUpload.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      file: false,
      url: false,
    }
  },
  computed: {
    isImage() {
      return this.$data.file && /\.(jpe?g|png|gif)$/i.test(this.$data.file.type)
    },
  },
  methods: {
    /**
     * Triggered when a file is changed on the input
     */
    handleFile(event: any) {
      this.$data.file = event.target.files[0]
      this.loadPicture(this.$data.file)
    },
    /**
     * Load a picture into a data URL push to data
     */
    loadPicture(file: File) {
      if (!file) return
      const self = this
      const reader = new FileReader()
      reader.onload = function (e: Event | any) {
        if (e.target) self.$data.url = e.target.result
      }
      reader.readAsDataURL(file)
    },
    /**
     * Clear local data
     * TODO: Clear input field, this currently breaks
     * when you upload the same file after cancelling
     */
    cancelUpload() {
      this.$data.file = false
      this.$data.url = false
    },
  },
})
</script>

<style scoped lang="less" src="./FileUpload.less"></style>
