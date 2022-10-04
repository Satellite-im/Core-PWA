<template src="./Disclaimer.html" />

<script lang="ts">
import Vue from 'vue'

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
      this.$router.push('/setup/phrase')
    },
    importAccount() {
      this.$router.push('/setup/importAccount')
    },
    async connectAccount() {
      await this.$store.dispatch('accounts/connectWallet')
      this.$router.push('/')
    },
  },
})
</script>

<style lang="less" scoped src="./Disclaimer.less"></style>
