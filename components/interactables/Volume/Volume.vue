<template src="./Volume.html"></template>

<script lang="ts">
import Vue from 'vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default Vue.extend({
  name: 'AudioVolume',
  components: {
    VueSlider,
  },
  props: {
    value: {
      type: Number,
      default: 100,
    },
    plain: {
      type: Boolean,
      default: false,
    },
    direction: {
      type: String,
      default: 'btt',
    },
  },
  methods: {
    /**
     * @method returnValue DocsTODO
     * @description
     * @example
     */
    returnValue(value: number) {
      this.$emit('change', value)
    },
    percentageFormatter(value: number) {
      return `${value}%`
    },
  },
})
</script>

<style lang="less" src="./Volume.less"></style>
