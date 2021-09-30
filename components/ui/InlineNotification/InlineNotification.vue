<template src="./InlineNotification.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    text: {
      type: String,
      default: 'Missing Text',
      required: true,
    },
  },
})
</script>
<style scoped lang="less" src="./InlineNotification.less"></style>
