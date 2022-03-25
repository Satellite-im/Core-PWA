<template src="./Privacy.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { Themes, Flairs, ThemeNames } from '~/store/ui/types.ts'
import { validURL } from '~/libraries/ui/Common'

export default Vue.extend({
  name: 'PrivacySettings',
  layout: 'settings',
  data() {
    return {
      maxChars: this.$Config.chat.maxChars,
      formatError: false,
      lengthError: false,
      serverTypes: [
        {
          text: this.$t('pages.privacy.ownInfo.satelliteServer'),
          value: 'satellite',
        },
        {
          text: this.$t('pages.privacy.ownInfo.publicServer'),
          value: 'public',
        },
      ],
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
        if (validURL(state) && state.length < this.maxChars + 1) {
          this.formatError = false
          this.lengthError = false
          this.$store.commit('settings/setOwnInfo', state)
          return
        }
        if (state.length > this.maxChars) {
          this.lengthError = true
        }
        if (!validURL(state)) {
          this.formatError = true
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
  methods: {
    onServerTypeChanged() {
      location.reload()
    },
  },
})
</script>

<style lang="less" scoped src="./Privacy.less"></style>
