<template src="./History.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
})
</script>
<style scoped lang="less" src="./History.less"></style>
