<template src="./Label.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    text: {
      type: String,
      default: 'Missing prop `text`.',
    },
  },
})
</script>
<style scoped lang="less" src="./Label.less"></style>
