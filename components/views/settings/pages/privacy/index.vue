<template src="./Privacy.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { validURL } from '~/libraries/ui/Common'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'PrivacySettings',
  layout: 'settings',
  data() {
    return {
      formatError: false as boolean,
      lengthError: false as boolean,
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
    ...mapState({
      ui: (state) => (state as RootState).ui,
      accounts: (state) => (state as RootState).accounts,
      settings: (state) => (state as RootState).settings,
      threadData: (state) => (state as RootState).textile.threadData,
    }),
    ...mapGetters('textile', ['getInitialized']),
    serverType: {
      set(state) {
        this.$store.commit('settings/setServerType', state)
      },
      get(): string {
        return this.settings.serverType
      },
    },
    ownInfo: {
      set(state: string) {
        if (validURL(state) && state.length < this.$Config.chat.maxChars + 1) {
          this.formatError = false
          this.lengthError = false
          this.$store.commit('settings/setOwnInfo', state)
          return
        }
        if (state.length > this.$Config.chat.maxChars) {
          this.lengthError = true
        }
        if (!validURL(state)) {
          this.formatError = true
        }
      },
      get(): string {
        return this.settings.ownInfo
      },
    },
    registry: {
      get(): boolean {
        return !this.accounts ? false : this.accounts.registry
      },
    },
    storePin: {
      set(state: boolean) {
        this.$store.commit('accounts/setStorePin', state)
      },
      get(): boolean {
        return !this.accounts ? false : this.accounts.storePin
      },
    },
    embeddedLinks: {
      set(state: boolean) {
        this.$store.commit('settings/embeddedLinks', state)
      },
      get(): boolean {
        return this.settings.embeddedLinks
      },
    },
    consentScan: {
      set(consentToScan: boolean) {
        this.$store.dispatch('textile/updateUserThreadData', { consentToScan })
      },
      get(): boolean {
        return this.threadData.consentToScan
      },
    },
    blockNsfw: {
      set(blockNsfw: boolean) {
        this.$store.dispatch('textile/updateUserThreadData', { blockNsfw })
      },
      get(): boolean {
        return this.threadData.blockNsfw
      },
    },
    displayCurrentActivity: {
      set(state: boolean) {
        this.$store.commit('settings/displayCurrentActivity', state)
      },
      get(): boolean {
        return this.settings.displayCurrentActivity
      },
    },
  },
})
</script>

<style lang="less" scoped src="./Privacy.less"></style>
