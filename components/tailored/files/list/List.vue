<template src="./List.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    path: {
      type: Array,
      default: () => [],
    },
    push: {
      type: Function,
      default: () => {},
    },
  },
})
</script>
<style scoped lang="less" src="./List.less"></style>
