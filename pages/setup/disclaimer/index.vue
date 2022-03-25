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
    goToPrivacySettings() {
      this.$router.push('privacy')
    },
    importAccount() {
      this.$router.push('importAccount')
    },
  },
})
</script>

<style lang="less" scoped src="./Disclaimer.less"></style>
