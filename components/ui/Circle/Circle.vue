<template src="./Circle.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { CircleType } from './types'

export default Vue.extend({
  props: {
    /**
     * Pixel diameter size of the circle
     */
    size: {
      type: Number,
      default: 36,
      required: false,
    },
    /**
     * Type of Circle, this determines what content we
     * load into the circle itself.
     */
    type: {
      type: String as PropType<CircleType>,
      default: 'random',
      required: true,
    },
    /**
     * Supported fontawesome icon
     */
    // eslint-disable-next-line vue/require-default-prop
    icon: {
      type: String,
      required: false,
    },
    /**
     * If provided the "circle" will have hard corners
     */
    square: {
      type: Boolean,
      default: false,
      required: false,
    },
    /**
     * Seed used to generate the random images
     */
    seed: {
      type: String,
      default: '0x0',
      required: false,
    },
    /**
     * Provided source if image icon type
     */
    source: {
      type: String,
      default: '',
      required: false,
    },
    /**
     * Color of the circles background
     */
    color: {
      type: String,
      default: '#16161e',
    },
    /**
     * String of the SatelliteCircle to be capitalized
     */
    name: {
      type: String,
      default: '',
    },
  },
})
</script>
<style scoped lang="less" src="./Circle.less"></style>
