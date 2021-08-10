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
  data() {
    return {
      numberOfTicks: 0,
    }
  },
  created() {
    window.addEventListener('resize', this.resizeHandler)
  },
  mounted() {
    this.$nextTick(() => {
      /* update number of ticks after whole view is rendrered */
      setTimeout(this.resizeHandler,50);
    })
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    // Returns the designated tick color based on the increment value
    getTickColor(increment: number): string {
      if (this.numberOfTicks) {
        const curPercentage = Math.floor((increment * 100) / this.numberOfTicks)
        if (curPercentage > this.value) {
          return ''
        } else if (curPercentage > 85) {
          return this.solid ? 'green-tick' : 'red-tick'
        } else if (curPercentage > 70) {
          return this.solid ? 'green-tick' : 'orange-tick'
        } else {
          return this.solid ? 'green-tick' : 'green-tick'
        }
      }
      return ''
    },
    resizeHandler(): number {
      if (this.$refs.meter) {
        console.log(this.$refs.meter.offsetWidth);
        let width = this.$refs.meter.offsetWidth
        this.numberOfTicks = Math.floor(width / 20)
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Meter.less"></style>
