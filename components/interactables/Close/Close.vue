<template src="./Close.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    action: {
      type: Function,
      default: () => {},
    },
  },
})
</script>
<style scoped lang="less" src="./Close.less"></style>
