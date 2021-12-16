<template src="./FloatingContainer.html" />
<script lang="ts">
import Vue from 'vue'

import { FlaskConicalIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    FlaskConicalIcon,
  },
  props: {
    customStyles: {
      type: Boolean,
      default: false,
    },
    /**
     * Optional Header Text
     * @remarks
     * You should include this if you'd like to label the floating container
     */
    heading: {
      type: String,
      required: false,
      default: '',
    },
    /**
     * Method to call when toggling the visibility of the container
     * @remarks
     * 99% of the time you should inculde this. If you're toggling it another way consider refactoring your code.
     */
    toggleMethod: {
      type: Function,
      required: false,
      default: () => {},
    },
    /**
     * Height in rem of the container
     */
    height: {
      type: Number,
      required: false,
      default: 14,
    },
    /**
     * Width in rem of the container
     */
    width: {
      type: Number,
      required: false,
      default: 8,
    },
    /**
     * Top and Right offsets of the container
     */
    offsets: {
      type: Array,
      required: false,
      default: () => [0, 0],
    },
  },
})
</script>
<style lang="less" src="./FloatingContainer.less"></style>
