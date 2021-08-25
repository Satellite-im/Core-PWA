<template src="./Marketplace.html"></template>

<script lang="ts">
import Vue from 'vue'
import { marketCategories } from '~/mock/marketplace'
export default Vue.extend({
  props: {
    closeModal: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      marketCategories,
    }
  },
  computed: {},
  methods: {},
})
</script>

<style scoped lang="less" src="./Marketplace.less"></style>
