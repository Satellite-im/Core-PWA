<template src="./TextWrap.html"></template>

<script lang="ts">
import Vue from 'vue'
// The meter takes a "value" prop and then displays ticks based on this event.
export default Vue.extend({
  props: {
    /**
     * Set white-space normal or nowrap
     */
    allowWrap: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
  },
})
</script>

<style scoped lang="less" src="./TextWrap.less"></style>
