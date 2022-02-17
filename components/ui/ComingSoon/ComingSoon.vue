<template src="./ComingSoon.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'ComingSoon',
  props: {
    tooltipText: {
      type: String,
      default: 'Coming Soon',
    },
    tooltipPosition: {
      type: String,
      default: 'right',
    },
    marginTopOverride: {
      type: String,
      default: '0px',
    },
  },
  methods: {
    preventClickthrough(event: Event) {
      event.stopPropagation()
    },
  },
})
</script>
<style scoped lang="less" src="./ComingSoon.less"></style>
