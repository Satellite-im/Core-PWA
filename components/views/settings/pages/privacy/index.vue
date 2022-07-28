<template src="./Privacy.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import { TranslateResult } from 'vue-i18n'
import { validURL } from '~/libraries/ui/Common'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  name: 'PrivacySettings',
  layout: 'settings',
  data() {
    return {
      formatError: false as boolean,
      lengthError: false as boolean,
      loading: [] as string[],
      privacySettings: iridium.settings.state.privacy,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      accounts: (state) => (state as RootState).accounts,
      settings: (state) => (state as RootState).settings,
      userThread: (state) => (state as RootState).textile.userThread,
    }),
    ...mapGetters('textile', ['getInitialized']),
    serverTypes(): { text: TranslateResult; value: string }[] {
      return [
        {
          text: this.$t('pages.privacy.ownInfo.satelliteServer'),
          value: 'satellite',
        },
        {
          text: this.$t('pages.privacy.ownInfo.publicServer'),
          value: 'public',
        },
      ]
    },
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
        iridium.settings.set('/privacy/embeddedLinks', state)
      },
      get(): boolean {
        return this.privacySettings.embeddedLinks
      },
    },
    consentScan: {
      async set(consentToScan: boolean) {
        this.loading.push('consentScan')
        await iridium.settings.set('/privacy/consentToScan', consentToScan)
        this.loading.splice(this.loading.indexOf('consentScan'), 1)
      },
      get(): boolean {
        return this.privacySettings.consentToScan
      },
    },
    blockNsfw: {
      async set(blockNsfw: boolean) {
        this.loading.push('blockNsfw')
        await iridium.settings.set('/privacy/blockNsfw', blockNsfw)
        this.loading.splice(this.loading.indexOf('blockNsfw'), 1)
      },
      get(): boolean {
        return this.privacySettings.blockNsfw
      },
    },
    displayCurrentActivity: {
      set(state: boolean) {
        iridium.settings.set('/privacy/displayCurrentActivity', state)
      },
      get(): boolean {
        return this.privacySettings.displayCurrentActivity
      },
    },
  },
})
</script>

<style lang="less" scoped src="./Privacy.less"></style>
