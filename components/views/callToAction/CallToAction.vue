<template src="./CallToAction.html"></template>

<script lang="ts">
import Vue from 'vue'

import { RadioIcon, SatelliteIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    RadioIcon,
    SatelliteIcon,
  },

  props: {
    closeModal: {
      type: Function,
      default: () => {},
    },
  },

  methods: {
    showTwitter() {
      window.open('https://twitter.com/satellite_im', '_blank')
    },
  },
})
</script>

<style scoped lang="less" src="./CallToAction.less"></style>
