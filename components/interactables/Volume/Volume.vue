<template src="./Volume.html"></template>

<script lang="ts">
import Vue from 'vue'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'

export default Vue.extend({
  name: 'AudioSettings',
  components: {
    VueSlider,
  },
  props: {
    volume: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      value: this.volume,
      percentageFormatter: (volumePercentage: number) => {
        return volumePercentage + ' %'
      },
    }
  },
  methods: {
    returnValue() {
      this.$emit('returned-value', this.value)
    },
  },
})
</script>

<style scoped lang="less" src="./Volume.less"></style>
