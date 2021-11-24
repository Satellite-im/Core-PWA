<template src="./Body.html"></template>
<script lang="ts">
import Vue from 'vue'

import { CheckCircle2Icon, RedoIcon, SendIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    CheckCircle2Icon,
    RedoIcon,
    SendIcon,
  },
  data() {
    return {
      paymentOption: 'usd',
    }
  },
  props: {
    updateMethod: {
      type: Function,
    },
  },
})
</script>
<style scoped lang="less" src="./Body.less"></style>
