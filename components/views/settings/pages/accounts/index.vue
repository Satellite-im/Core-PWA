<template src="./Accounts.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { ClipboardIcon } from 'satellite-lucide-icons'
import { RootState } from '~/types/store/store'
import iridium from '~/libraries/Iridium/IridiumManager'

export default Vue.extend({
  name: 'AccountsSettings',
  components: {
    ClipboardIcon,
  },
  layout: 'settings',
  data() {
    return {
      showPhrase: false,
      profile: iridium.profile.state,
    }
  },
  computed: {
    ...mapState({
      storePin: (state) => (state as RootState).accounts.storePin,
      accountPhrase: (state) => (state as RootState).accounts.phrase,
    }),
    getId(): string | undefined {
      if (!iridium.connector) return
      return this.profile
        ? `${this.profile.name}#${iridium.id.substring(iridium.id.length - 6)}`
        : `${iridium.id}`
    },
    storePin: {
      set(state) {
        this.$store.commit('accounts/setStorePin', state)
      },
      get(): boolean {
        return !!this.storePin
      },
    },
    splitPhrase(): string[] {
      return this.accountPhrase.split(' ')
    },
  },
  methods: {
    /**
     * @method togglePhrase DocsTODO
     * @description
     * @example
     */
    togglePhrase() {
      this.showPhrase = !this.showPhrase
    },
    copyAddress(copyText: string) {
      navigator.clipboard.writeText(copyText)
      this.$toast.show(this.$t('ui.copied') as string)
    },
    copyPhrase() {
      navigator.clipboard.writeText(this.accountPhrase)
      this.$toast.show(this.$t('ui.copied') as string)
    },
  },
})
</script>

<style scoped lang="less" src="./Accounts.less"></style>
