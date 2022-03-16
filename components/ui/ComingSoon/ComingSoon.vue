<template src="./ComingSoon.html"></template>

<script lang="ts">
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    overlayText: string
  }
}

export default Vue.extend({
  name: 'ComingSoon',
  props: {
    tooltipText: {
      type: String,
      default: 'Coming Soon',
      required: false,
    },
    tooltipPosition: {
      type: String,
      default: 'right',
      required: false,
    },
    marginTopOverride: {
      type: String,
      default: '0px',
      required: false,
    },
    areaCover: {
      type: Boolean,
      default: false,
      required: false,
    },
    hide: {
      type: Boolean,
      default: false,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
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
