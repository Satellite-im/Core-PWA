<template src="./Modal.html"></template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    title: {
      type: String,
      default: '',
      required: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style scoped lang="less" src="./Modal.less"></style>
