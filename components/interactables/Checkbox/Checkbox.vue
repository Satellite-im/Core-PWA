<template src="./Checkbox.html"></template>

<script lang="ts">
import Vue from 'vue'
import { CheckIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  name: 'Checkbox',
  components: {
    CheckIcon,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
})
</script>

<style scoped lang="less" src="./Checkbox.less"></style>
