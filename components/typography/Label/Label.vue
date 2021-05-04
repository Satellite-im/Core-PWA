<template src="./Label.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    /**
     * Text to be included in the label
     */
    text: {
      type: String,
      default: 'Missing prop `text`.',
    },
  },
})
</script>
<style scoped lang="less" src="./Label.less"></style>
