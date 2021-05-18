<template src="./LoadingInline.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    text: {
      type: String,
      default: 'Loading...',
    },
  },
})
</script>
<style scoped lang="less" src="./LoadingInline.less"></style>
