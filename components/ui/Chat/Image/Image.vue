<template src="./Image.html" />
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    alt: {
      type: String,
      default: 'Image',
    },
    full: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: '404.png',
    },
  },
  data() {
    return {
      showfull: false,
    }
  },
  methods: {
    /**
     * @method openImage DocsTODO
     * @description
     * @example
     */
    openImage() {
      // @ts-ignore
      window?.open(source, '_blank').focus()
    },
  },
})
</script>
<style scoped lang="less" src="./Image.less"></style>
