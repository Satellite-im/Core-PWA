<template src="./Item.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { Transaction } from '~/types/ui/wallet'

export default Vue.extend({
  props: {
    transaction: {
      type: Object as PropType<Transaction>,
      default: () => {},
    },
  },
  methods: {
    getTransactionColor(tx: Transaction) {
      return tx.state === 'sent'
        ? 'txamount red'
        : tx.state === 'requested'
        ? 'txamount'
        : 'txamount green'
    },
  },
})
</script>
<style scoped lang="less" src="./Item.less"></style>
