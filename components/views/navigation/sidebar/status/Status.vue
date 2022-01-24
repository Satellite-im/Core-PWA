<template src="./Status.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['accounts']),
    src(): string {
      const hash = this.accounts.details.profilePicture
      return hash ? `${this.$Config.textile.browser}/ipfs/${hash}` : ''
    },
  },
})
</script>

<style scoped lang="less" src="./Status.less"></style>
