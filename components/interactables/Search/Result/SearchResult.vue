<template src="./SearchResult.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    searchQuery: {
      type: String,
      default: '',
    },
  },
})
</script>
<style scoped lang="less" src="./SearchResult.less"></style>
