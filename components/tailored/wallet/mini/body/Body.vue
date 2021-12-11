<template src="./Body.html" />
<script lang="ts">
import Vue from 'vue'

import { CheckCircle2Icon, RedoIcon, SendIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    CheckCircle2Icon,
    RedoIcon,
    SendIcon,
  },
  props: {
    updateMethod: {
      type: Function,
    },
  },
  data() {
    return {
      paymentOption: 'usd',
    }
  },
})
</script>
<style scoped lang="less" src="./Body.less"></style>
