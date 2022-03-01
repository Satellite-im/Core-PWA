<template src="./Privacy.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Themes, Flairs, ThemeNames } from '~/store/ui/types.ts'
export default Vue.extend({
  name: 'PrivacySettings',
  layout: 'settings',
  computed: {
    ...mapState(['ui', 'accounts', 'settings']),
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
