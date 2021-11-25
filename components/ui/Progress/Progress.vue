<template src="./Progress.html" />
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    progress: {
      type: Number,
      default: 0,
    },
  },
})
</script>
<style scoped lang="less" src="./Progress.less"></style>
