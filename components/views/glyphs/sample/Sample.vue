<template src="./Sample.html" />
<script lang="ts">
import Vue from 'vue'
import * as loadImg from '~/assets/img/glyphLoader.png'

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
      return this.isLoaded ? src : loadImg
    },
  },
})
</script>
<style scoped lang="less" src="./Sample.less"></style>
