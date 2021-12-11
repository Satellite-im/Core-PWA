<template src="./TypingIndicator.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    userName: {
      type: String,
      default: '',
      required: false,
    },
  },
})
</script>

<style scoped lang="less" src="./TypingIndicator.less"></style>
