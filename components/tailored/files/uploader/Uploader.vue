<template src="./Uploader.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    file: {
      type: File,
      default: () => {},
    },
    url: {
      type: String,
      default: '',
    },
    complete: {
      type: Function,
      default: () => () => {},
    },
    cancelUpload: {
      type: Function,
      default: () => () => {},
    },
  },
})
</script>
<style scoped lang="less" src="./Uploader.less"></style>
