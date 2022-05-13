<template src="./Unlock.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { Dexie } from 'dexie'
import { UnlockIcon, ChevronRightIcon, InfoIcon } from 'satellite-lucide-icons'
import { ConsoleWarning } from '~/utilities/ConsoleWarning'
import { RootState } from '~/types/store/store'

export default Vue.extend({
  name: 'UnlockScreen',
  components: {
    UnlockIcon,
    ChevronRightIcon,
    InfoIcon,
  },
  data() {
    return {
      pin: '',
      error: '',
      decrypting: false,
      accessCode: '' as string,
      isValidCode: false as boolean,
      codeMessage: '' as string,
    }
  },
  computed: {
    ...mapState({
      ui: (state) => (state as RootState).ui,
      accounts: (state) => (state as RootState).accounts,
    }),
    storePin: {
      set(state) {
        this.$store.commit('accounts/setStorePin', state)
      },
      get(): boolean {
        return !this.accounts ? false : this.accounts.storePin
      },
    },
  },
  watch: {
    accessCode(val: string) {
      if (val.length !== 10) {
        this.codeMessage = ''
        return
      }
      this.isValidCode = Math.random() < 0.5
      this.codeMessage = (
        this.isValidCode
          ? this.$t('pages.unlock.good_code')
          : this.$t('pages.unlock.bad_code')
      ) as string
    },
  },
  mounted() {
    // This information can be useful for users to help us find and report bugs.
    ConsoleWarning(this.$config.clientVersion, this.$store.state)

    this.$store.commit('accounts/lock')
  },
  methods: {
    /**
     * @method toggleChangelogVisibility
     * @description This toggles the changelog modal on and off
     * @returns void
     * @example this.toggleChangelogVisibility()
     */
    toggleChangelogVisibility(): void {
      this.$store.commit('ui/toggleModal', {
        name: 'changelog',
        state: !this.ui.modals.changelog,
      })
    },
    /**
     * @method decrypt DocsTODO
     * @description Decrypt stored encrypted data into memory
     * @example
     */
    async decrypt() {
      this.decrypting = true
      this.error = ''

      try {
        await this.$store.dispatch('accounts/unlock', this.pin)

        if (this.accounts.phrase === '') {
          // manually clear local storage and indexeddb if it exists
          try {
            await this.$store.dispatch('settings/clearLocalStorage')
          } catch (e: any) {
            this.$toast.error(this.$t(e.message) as string)
            this.$router.replace('/setup/disclaimer')
          }
        } else {
          this.$router.replace('/')
        }
      } catch (error: any) {
        this.error = error.message
        this.pin = ''
      }

      this.decrypting = false
    },
    // Create & store a new pin, then decrypt.
    /**
     * @method create DocsTODO
     * @description
     * @example
     */
    async create() {
      if (!this.isValidCode) {
        this.codeMessage = this.$t('pages.unlock.bad_code') as string
        return
      }
      try {
        await this.$store.dispatch('accounts/setPin', this.pin)
        await this.decrypt()
      } catch (error: any) {
        this.error = error.message
      }
    },
    async deleteAccount() {
      await this.$store.dispatch('settings/clearLocalStorage')
      location.reload()
    },
  },
})
</script>

<style lang="less" scoped src="./Unlock.less"></style>
