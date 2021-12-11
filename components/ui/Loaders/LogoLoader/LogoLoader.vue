<template src="./LogoLoader.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    size: {
      type: Number,
      default: 64,
    },
  },
})
</script>
<style scoped lang="less" src="./LogoLoader.less"></style>
