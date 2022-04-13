<template src="./Privacy.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { validURL } from '~/libraries/ui/Common'

export default Vue.extend({
  name: 'PrivacyScreen',
  computed: {
    ...mapState(['settings']),
  },
  methods: {
    async generateWallet() {
      await this.$store.dispatch('accounts/generateWallet')
      this.$router.push('phrase')
    },
    isDisabled() {
      return !this.settings.ownInfo && this.settings.serverType === 'own'
    },
  },
})
</script>

<style lang="less" scoped src="./Privacy.less"></style>
