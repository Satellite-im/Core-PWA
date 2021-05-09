<template src="./Image.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    alt: {
      type: String,
      default: 'Image',
    },
    full: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: '404.png',
    },
  },
})
</script>
<style scoped lang="less" src="./Image.less"></style>
