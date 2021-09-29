<template src="./Volume.html"></template>

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
<<<<<<< HEAD
      /**
       * @method
       * @description
       * @param
       * @returns
       * @example
       */
      percentageFormatter: (volumePercentage: number) => {
=======
      percentageFormatter: (volumePercentage) => {
>>>>>>> 8edd0a2566b17c5f092bfe3f614264f80a6411d2
        return volumePercentage + ' %'
      },
    }
  },
  methods: {
    /**
     * @method returnValue
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
