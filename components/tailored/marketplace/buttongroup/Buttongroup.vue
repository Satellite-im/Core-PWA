<template src="./Buttongroup.html"></template>

<script lang="ts">
import Vue from 'vue'
import { marketCategories } from '~/mock/marketplace'
export default Vue.extend({
  props: {},
  data() {
    return {
      marketCategories,
      active: null as HTMLElement | null,
    }
  },
  computed: {},
})
</script>

<style scoped lang="less" src="./Buttongroup.less"></style>
