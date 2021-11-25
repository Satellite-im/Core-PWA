<template src="./Listing.html" />

<script lang="ts">
import Vue from 'vue'
import { marketProducts } from '~/mock/marketplace'
export default Vue.extend({
  props: {},
  data() {
    return {
      marketProducts,
    }
  },
})
</script>

<style scoped lang="less" src="./Listing.less"></style>
