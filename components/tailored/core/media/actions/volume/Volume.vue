<template src="./Volume.html"></template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['volumeLevel'],
  data() {
    return {
      volume: this.volumeLevel,
      showSlider: false,
    }
  },
  mounted() {
    document.addEventListener('click', this.hideSlider)
  },
  methods: {
    toggleSlider() {
      this.$data.showSlider = !this.$data.showSlider
    },
    hideSlider(event: Event) {
      if (
        (this.$refs.volumegroup as Element).contains(event.target as Node) ===
        false
      ) {
        this.$data.showSlider = false
      }
    },
    receivedValue(volume: Number) {
      // console.log('received volume is ', volume)
      this.volume = volume
      this.$emit('volumeControlValueChange', volume)
    },
  },
})
</script>

<style scoped lang="less" src="./Volume.less"></style>
