<template src="./Sample.html" />
<script lang="ts">
import Vue from 'vue'
import * as loadImg from '~/assets/img/glyphLoader.webp'

export default Vue.extend({
  props: {
    glyphUrls: { type: Array, required: true, default: null },
  },
  data() {
    return {
      isLoaded: false,
    }
  },
  methods: {
    setLoaded() {
      this.isLoaded = true
    },
    getSrc(src) {
      let imgSrc = src
      if (src.includes('/$1/')) {
        imgSrc = src.replace('$1', 'small')
      }
      return this.isLoaded ? imgSrc : loadImg
    },
  },
})
</script>
<style scoped lang="less" src="./Sample.less"></style>
