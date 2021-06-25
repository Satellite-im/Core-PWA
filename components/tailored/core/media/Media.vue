<template src="./Media.html"></template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      defaultVolumeLevel: 100,
    }
  },
  methods: {
    returnedValue(volume: number) {
      this.defaultVolumeLevel = volume
    },
  },
})
</script>

<style scoped lang="less" src="./Media.less"></style>
