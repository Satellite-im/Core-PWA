<template src="./Disclaimer.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'DisclaimerScreen',
  head() {
    return {
      title: this.meta.title,
    }
  },
  computed: {
    ...mapState(['meta']),
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
