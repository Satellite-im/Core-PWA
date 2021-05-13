<template src="./List.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    /**
     * The array of children to path through
     */
    path: {
      type: Array,
      default: () => [],
    },
    /**
     * Push a new child to the path
     */
    push: {
      type: Function,
      default: () => {},
    },
  },
})
</script>
<style scoped lang="less" src="./List.less"></style>
