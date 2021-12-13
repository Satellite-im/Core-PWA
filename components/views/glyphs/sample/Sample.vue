<template src="./Sample.html" />
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    glyphs: { type: Array, required: true, default: null },
  },
})
</script>
<style scoped lang="less" src="./Sample.less"></style>
