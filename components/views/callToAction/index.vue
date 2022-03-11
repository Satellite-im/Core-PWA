<template src="./index.html"></template>

<script lang="ts">
import Vue from 'vue'

import { RadioIcon, SatelliteIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  name: 'CallToAction',

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

  data() {
    return {
      subject: 'Glyphs',
    }
  },

  methods: {
    showTwitter() {
      window.open('https://twitter.com/satellite_im', '_blank')
    },
  },
})
</script>

<style scoped lang="less" src="./index.less"></style>
