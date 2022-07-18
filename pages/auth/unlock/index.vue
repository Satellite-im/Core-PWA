<template src="./Unlock.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
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
      status: 'idle' as 'idle' | 'loading',
      error: '',
      step: 'signup' as 'signup' | 'login',
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
    error(newValue) {
      if (newValue !== '' && this.status !== 'idle') {
        this.status = 'idle'
      }
    },
    status(newValue) {
      if (newValue === 'loading' && this.error !== '') {
        this.error = ''
      }
    },
  },
  beforeMount() {
    if (this.accounts.pinHash) this.step = 'login'
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
     * @method getIcon DocsTODO
     * @description
     * @returns
     * @example
     */
    getIcon(): string {
      if (this.accounts.pinHash) {
        return 'unlocked'
      }
      return 'locked'
    },
    // Decrypt stored encrypted data into memory
    /**
     * @method decrypt DocsTODO
     * @description
     * @example
     */
    async decrypt() {
      try {
        await this.$store.dispatch('accounts/unlock', this.pin)

        if (this.accounts.phrase === '') {
          // manually clear local storage and indexeddb if it exists
          try {
            await this.deleteAccount()
          } catch (e: any) {
            this.$toast.error(this.$t(e.message) as string)
          }
          this.$router.replace('/setup/disclaimer')
        } else {
          this.$router.replace('/')
        }
      } catch (error: any) {
        this.error = error.message
        this.pin = ''
      }
    },
    // Create & store a new pin, then decrypt.
    /**
     * @method create DocsTODO
     * @description
     * @example
     */
    async create() {
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
    action() {
      this.status = 'loading'
      return this.step === 'login' ? this.decrypt() : this.create()
    },
  },
})
</script>

<style lang="less" scoped src="./Unlock.less"></style>
