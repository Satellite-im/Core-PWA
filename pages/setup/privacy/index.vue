<template src="./Privacy.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ServerTypes } from '~/components/views/settings/pages/privacy/options'

export default Vue.extend({
  name: 'PrivacyScreen',
  data() {
    return {
      ServerTypes,
    }
  },
  computed: {
    ...mapState(['ui', 'accounts', 'settings']),
    serverType: {
      set(state) {
        this.$store.commit('settings/setServerType', state)
      },
      get() {
        return this.settings.serverType
      },
    },
    ownInfo: {
      set(state) {
        this.$store.commit('settings/setOwnInfo', state)
      },
      get() {
        return this.settings.ownInfo
      },
    },
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
