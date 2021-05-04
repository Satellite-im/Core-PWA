<template src="./Meter.html"></template>

<script lang="ts">
import Vue from 'vue'
// The meter takes a "value" prop and then displays ticks based on this event.
// You can also pass a "solid" prop which will disable the color scale of the ticks
export default Vue.extend({
  props: {
    /**
     * Amount of 'ticks' to be filled in the meter.
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
  },
  methods: {
    // Returns the designated tick color based on the increment value
    getTickColor(increment: number): string {
      if (increment > this.value) {
        return ''
      } else if (increment > 22) {
        return this.solid ? 'green-tick' : 'red-tick'
      } else if (increment > 18) {
        return this.solid ? 'green-tick' : 'orange-tick'
      } else {
        return this.solid ? 'green-tick' : 'green-tick'
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Meter.less"></style>
