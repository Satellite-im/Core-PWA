<template src="./Unit.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    text: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
})
</script>

<style scoped lang="less" src="./Unit.less"></style>
