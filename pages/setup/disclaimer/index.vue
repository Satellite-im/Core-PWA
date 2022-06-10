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
      this.$router.push('phrase')
    },
    importAccount() {
      this.$router.push('importAccount')
    },
    async connectPhantom() {
      await this.$store.dispatch('accounts/connectPhantom')
      this.$router.push('/auth/register')
    },
  },
})
</script>

<style lang="less" scoped src="./Disclaimer.less"></style>
