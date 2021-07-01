<template src="./Volume.html"></template>

<script lang="ts">
import Vue from 'vue'

import { mapState } from 'vuex'

export default Vue.extend({
  props: {
    volumeLevel: {
      type: Number,
      default: 100,
    },
  },
  data() {
    return {
      showSlider: false,
    }
  },
  computed: {
    ...mapState(['audio']),
  },
  mounted() {
    document.addEventListener('click', this.hideSlider)
  },
  destroyed() {
    document.removeEventListener('click', this.hideSlider)
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
      this.$store.commit('setVolume', volume)
      this.$emit('volumeControlValueChange', volume)
    },
  },
})
</script>

<style scoped lang="less" src="./Volume.less"></style>
