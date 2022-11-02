<template src="./Page.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: undefined,
    },
    subtitle: {
      type: String,
      default: undefined,
    },
  },
})
</script>

<style scoped lang="less" src="./Page.less"></style>
