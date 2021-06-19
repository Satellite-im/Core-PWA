<template src="./Volume.html"></template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      showSlider: false,
    }
  },
  methods: {
    toggleSlider() {
      this.$data.showSlider = !this.$data.showSlider
    },
  },
})
</script>

<style scoped lang="less" src="./Volume.less"></style>
