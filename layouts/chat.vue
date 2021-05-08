<template src="./chat/Chat.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Chat',
  middleware: 'authenticated',
  data() {
    return {
      sidebar: true,
    }
  },
})
</script>

<style lang="less" src="./chat/Chat.less"></style>
