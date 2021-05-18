<template src="./files/Files.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'FilesLayout',
  middleware: 'authenticated',
  data() {
    return {
      sidebar: true,
    }
  },
})
</script>

<style lang="less" src="./files/Files.less"></style>
