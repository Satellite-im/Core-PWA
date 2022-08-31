<template src="./ImportWallet.html"></template>

<script lang="ts">
import Vue from 'vue'
import { WalletReadyState } from '@solana/wallet-adapter-base'
import { getUsableWallets, walletList } from '~/libraries/WalletManager/utils'

export default Vue.extend({
  name: 'ImportWalletScreen',
  data() {
    return {
      error: '',
      loading: true,
      selected: null,
    }
  },
  computed: {
    detectedWallets() {
      return getUsableWallets().filter(
        (el) => el.state === WalletReadyState.Installed,
      )
    },
    availableWallets() {
      return getUsableWallets().filter(
        (el) => el.state !== WalletReadyState.Installed,
      )
    },
  },
  mounted() {
    this.loading = false
    window.console.log(this.detectedWallets)
  },
  methods: {
    getImgUrl(pic: String) {
      return require('@/assets/icons/' + pic)
    },
    openWalletPage(wallet: walletList) {
      if (wallet.url) {
        window.open(wallet.url, '_blank')
      }
    },
    async selectWallet(wallet: walletList) {
      this.selected = wallet
      await this.$store.commit('accounts/setPhrase', wallet.name)
    },
    async importSelectedWallet() {
      await this.$store.dispatch('accounts/connectWallet')
      await this.$router.push('/')
    },
  },
})
</script>

<style lang="less" scoped src="./ImportWallet.less"></style>
