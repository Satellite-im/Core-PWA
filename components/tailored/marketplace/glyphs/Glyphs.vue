<template src="./Glyphs.html"></template>

<script lang="ts">
import Vue from 'vue'
import { marketGlyphs } from '~/mock/marketplace'
export default Vue.extend({
  props: {},
  data() {
    return {
      marketGlyphs,
    }
  },
})
</script>

<style scoped lang="less" src="./Glyphs.less"></style>
