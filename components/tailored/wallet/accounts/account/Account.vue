<template src="./Account.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import { CreditCardIcon, BinaryIcon } from 'satellite-lucide-icons'

import { Account } from 'types/ui/wallet'

export default Vue.extend({
  components: {
    CreditCardIcon,
    BinaryIcon,
  },
  props: {
    account: {
      type: Object as PropType<Account>,
      default: () => {},
    },
  },
})
</script>
<style scoped lang="less" src="./Account.less"></style>
