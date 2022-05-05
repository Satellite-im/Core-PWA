<template src="./ErrorNetwork.html" />

<script>
import Vue from 'vue'
import { mapState } from 'vuex'

import { XIcon, RefreshCwIcon } from 'satellite-lucide-icons'

/**
 * @component Error
 * @description Component that takes an error message to display including source and extra details.
 * setTimeout prop is a bool that if true will auto close the modal after 5 seconds
 * @example
 */
export default Vue.extend({
  name: 'ErrorNetwork',
  components: {
    XIcon,
    RefreshCwIcon,
  },
  props: {
    closeModal: {
      type: Function,
      default: () => {},
      required: true,
    },
    action: {
      type: Function,
      default: () => {},
      required: true,
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./ErrorNetwork.less"></style>
