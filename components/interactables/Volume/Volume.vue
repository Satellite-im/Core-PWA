<template src="./Volume.html" />

<script>
import Vue from 'vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default Vue.extend({
  name: 'AudioVolume',
  components: {
    VueSlider,
  },
  props: {
    volume: {
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
  data() {
    return {
      value: this.volume,
      /**
       * @method percentageFormatter DocsTODO
       * @description
       * @param volumePercentage
       * @returns
       * @example
       */
      percentageFormatter: (volumePercentage) => {
        return volumePercentage + ' %'
      },
    }
  },
  methods: {
    /**
     * @method returnValue DocsTODO
     * @description
     * @example
     */
    returnValue() {
      this.$emit('returned-value', this.value)
    },
  },
})
</script>

<style lang="less" src="./Volume.less"></style>
