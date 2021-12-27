<template src="./Meter.html"></template>

<script lang="ts">
import Vue from 'vue'
// The meter takes a "value" prop and then displays ticks based on this event.
// You can also pass a "solid" prop which will disable the color scale of the ticks
export default Vue.extend({
  props: {
    /**
     * Percentage of Volume
     */
    value: {
      type: Number,
      default: 0,
    },
    /**
     * Should the meter support a single color scheme
     */
    solid: {
      type: Boolean,
      default: false,
    },
    /**
     * Custom meter height value
     */
    height: {
      type: Number,
      default: 20,
    },
  },
})
</script>

<style scoped lang="less" src="./Meter.less"></style>
