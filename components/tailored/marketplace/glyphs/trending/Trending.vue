<template src="./Trending.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'

export default Vue.extend({
  props: {
    list: {
      type: Array as PropType<Array<any>>,
      default: () => [],
    },
  },
})
</script>

<style scoped lang="less" src="./Trending.less"></style>
