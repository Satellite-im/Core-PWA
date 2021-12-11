<template src="./Privacy.html"></template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'PrivacyScreen',
  data() {
    return {
      registry: true,
      storePin: false,
      embeds: true,
      activity: true,
    }
  },
})
</script>

<style lang="less" scoped src="./Privacy.less"></style>
