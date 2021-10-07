<template src="./List.html"></template>

<script lang="ts">
import Vue from 'vue'
import { SettingsIcon, PlusIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    SettingsIcon,
    PlusIcon,
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

<style scoped lang="less" src="./List.less"></style>
