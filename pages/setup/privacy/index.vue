<template src="./Privacy.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'PrivacyScreen',
  computed: {
    ...mapState(['ui', 'accounts', 'settings']),
    registry: {
      set(state) {
        this.$store.commit('accounts/setRegistry', state)
      },
      get() {
        return !this.accounts ? false : this.accounts.registry
      },
    },
    storePin: {
      set(state) {
        this.$store.commit('accounts/setStorePin', state)
      },
      get() {
        return !this.accounts ? false : this.accounts.storePin
      },
    },
    embeddedLinks: {
      set(state) {
        this.$store.commit('settings/embeddedLinks', state)
      },
      get() {
        return this.settings.embeddedLinks
      },
    },
    displayCurrentActivity: {
      set(state) {
        this.$store.commit('settings/displayCurrentActivity', state)
      },
      get() {
        return this.settings.displayCurrentActivity
      },
    },
  },
  methods: {
    async generateWallet() {
      await this.$store.dispatch('accounts/generateWallet')
      this.$router.push('phrase')
    },
  },
})
</script>

<style lang="less" scoped src="./Privacy.less"></style>
