<template src="./Listing.html"></template>

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
  computed: {},
  methods: {},
})
</script>

<style scoped lang="less" src="./Listing.less"></style>
