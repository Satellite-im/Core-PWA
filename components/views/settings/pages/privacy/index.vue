<template src="./Privacy.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Themes, Flairs, ThemeNames } from '~/store/ui/types.ts'
import { ServerTypes } from '~/components/views/settings/pages/privacy/options'
import { validURL } from '~/libraries/ui/Common'

export default Vue.extend({
  name: 'PrivacySettings',
  layout: 'settings',
  data() {
    return {
      ServerTypes,
      ownInfoError: false,
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
        if (validURL(state)) {
          this.ownInfoError = false
          this.$store.commit('settings/setOwnInfo', state)
        } else {
          this.ownInfoError = true
        }
      },
      get() {
        return this.settings.ownInfo
      },
    },
    registry: {
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
})
</script>

<style lang="less" scoped src="./Privacy.less"></style>
