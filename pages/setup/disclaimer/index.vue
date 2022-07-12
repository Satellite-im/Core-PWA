<template src="./Disclaimer.html" />

<script lang="ts">
import Vue from 'vue'
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets'
import IdentityManager from '~/libraries/Iridium/IdentityManager'
import logger from '~/plugins/local/logger'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  name: 'DisclaimerScreen',
  computed: {
    isLoading() {
      return this.$store.state.accounts.loading
    },
  },
  methods: {
    async generateWallet() {
      await this.$store.dispatch('accounts/generateWallet')
      this.$router.push('phrase')
    },
    importAccount() {
      this.$router.push('importAccount')
    },
    async connectAccount() {
      await this.$store.dispatch('accounts/connectWallet')
      this.$router.push('/')
    },
  },
})
</script>

<style lang="less" scoped src="./Disclaimer.less"></style>
