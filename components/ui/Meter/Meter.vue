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
      ro: new ResizeObserver(() => {}),
    }
  },
  beforeMount() {
    this.resizeHandler()
  },
  beforeDestroy() {
    this.ro.unobserve(this.$refs.meter as Element)
  },
  mounted() {
    this.ro = new ResizeObserver((_) => {
      this.resizeHandler()
    })
    this.ro.observe(this.$refs.meter as Element)

    this.$nextTick(() => {
      /* update number of ticks after whole view is rendrered */
      setTimeout(this.resizeHandler, 50)
    })
  },
  methods: {
    onResize() {
      this.resizeHandler()
    },
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
    resizeHandler() {
      const meterElm: HTMLElement = this.$refs.meter as HTMLElement
      if (meterElm) {
        const width = meterElm.clientWidth
        this.numberOfTicks = Math.floor(width / 20)
      }
    },
  },
})
</script>

<style scoped lang="less" src="./Meter.less"></style>
