<template src="./Slimbar.html"></template>

<script lang="ts">
import Vue from 'vue'
import { SettingsIcon, PlusIcon, SatelliteIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    SettingsIcon,
    PlusIcon,
    SatelliteIcon,
  },
  props: {
    unreads: {
      type: Array,
      default() {
        return []
      },
    },
    servers: {
      type: Array,
      default() {
        return []
      },
    },
    openModal: {
      type: Function,
      default: () => {},
      required: false,
    },
  },
})
</script>

<style scoped lang="less" src="./Slimbar.less"></style>
