<template src="./Volume.html"></template>

<script lang="ts">
import Vue from 'vue'

import {
  VolumeIcon,
  Volume1Icon,
  Volume2Icon,
  VolumeXIcon,
} from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    VolumeIcon,
    Volume1Icon,
    Volume2Icon,
    VolumeXIcon,
  },
  props: {
    volume: {
      type: Number,
      default: 100,
    },
    isPopup: {
      type: Boolean,
      default: false,
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
      sliderVisible: false,
      lastVal: 0,
    }
  },
  methods: {
    toggleSlider() {
      console.log('toggle')
      this.sliderVisible = !this.showSlider
    },
    showSlider() {
      console.log('show')
      this.sliderVisible = true
    },
    hideSlider(event: Event) {
      console.log('hide')
      this.sliderVisible = false
    },
    toggleMute() {
      console.log('toggle to this.lastVal', this.lastVal)
      if (this.volume) {
        this.lastVal = this.volume
      }
      this.$emit('volumeControlValueChange', this.volume ? 0 : this.lastVal)
    },
    receivedValue(value: number) {
      this.$emit('volumeControlValueChange', value)
    },
  },
})
</script>

<style scoped lang="less" src="./Volume.less"></style>
