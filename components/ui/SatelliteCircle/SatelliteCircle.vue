<template src="./SatelliteCircle.html"></template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { SatelliteIcon } from 'satellite-lucide-icons'
import { addressToNumber, toHex } from '~/utilities/Circle'

export default Vue.extend({
  components: {
    SatelliteIcon,
  },
  props: {
    address: {
      type: String,
      default: '',
      required: false,
    },
    name: {
      type: String,
      default: '',
      required: false,
    },
    colors: {
      type: Array as PropType<Array<string>>,
      required: false,
      default: () => [
        '#fc5c65',
        '#fd9644',
        '#fed330',
        '#26de81',
        '#2bcbba',
        '#eb3b5a',
        '#fa8231',
        '#f7b731',
        '#20bf6b',
        '#0fb9b1',
        '#45aaf2',
        '#4b7bec',
        '#a55eea',
        '#778ca3',
        '#2d98da',
        '#3867d6',
        '#8854d0',
        '#a5b1c2',
        '#4b6584',
      ],
    },
  },
  computed: {
    finalColor() {
      return this.colors[
        addressToNumber(toHex(this.address)) % this.colors.length
      ]
    },
    firstLetter() {
      return this.name.charAt(0).toUpperCase()
    },
  },
})
</script>

<style scoped lang="less" src="./SatelliteCircle.less"></style>
