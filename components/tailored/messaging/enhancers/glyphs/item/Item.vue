<template src="./Item.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    width: {
      type: Number,
      default: 28,
      required: false,
    },
    height: {
      type: Number,
      default: 28,
      required: false,
    },
    src: {
      type: String,
      default: '',
    },
  },
  methods: {
    getStyle() {
      return {
        'background-image': `url(${this.src})`,
        width: `${this.width}px`,
        height: `${this.height}px`,
      }
    },
  },
})
</script>
<style scoped lang="less" src="./Item.less"></style>
