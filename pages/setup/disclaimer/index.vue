<template src="./Disclaimer.html"></template>

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
      await this.$store.dispatch('generateWallet')

      this.$router.push('phrase')
    },
  },
})
</script>

<style lang="less" scoped src="./Disclaimer.less"></style>
