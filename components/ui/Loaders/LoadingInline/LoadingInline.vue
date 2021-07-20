<template src="./LoadingInline.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    text: {
      type: String,
      default: 'Loading...',
    },
    muted: {
      type: Boolean,
      default: false,
    },
    spaced: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
<style scoped lang="less" src="./LoadingInline.less"></style>
