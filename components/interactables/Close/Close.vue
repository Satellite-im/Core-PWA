<template src="./Close.html" />
<script lang="ts">
import Vue from 'vue'

import { XIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    XIcon,
  },
  props: {
    /**
     * Function or method to be triggered when the close button is clicked.
     */
    action: {
      type: Function,
      default: () => {},
    },
  },
})
</script>
<style scoped lang="less" src="./Close.less"></style>
