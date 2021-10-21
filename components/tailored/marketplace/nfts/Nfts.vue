<template src="./Nfts.html"></template>

<script lang="ts">
import Vue from 'vue'
import { marketNfts } from '~/mock/marketplace'
export default Vue.extend({
  props: {},
  data() {
    return {
      marketNfts,
    }
  },
})
</script>

<style scoped lang="less" src="./Nfts.less"></style>
