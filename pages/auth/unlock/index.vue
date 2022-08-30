<template src="./Unlock.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { UnlockIcon, ChevronRightIcon, InfoIcon } from 'satellite-lucide-icons'
import { ConsoleWarning } from '~/utilities/ConsoleWarning'
import { RootState } from '~/types/store/store'
import { AccountsError } from '~/store/accounts/types'

const DEV_PIN = '11111'

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
      isChrome: false,
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
    isDev(): boolean {
      return (
        location.href.startsWith('http://localhost') ||
        location.href.startsWith('https://iridium-dev') ||
        location.href.startsWith('https://core-dev') ||
        location.host.endsWith('.on.fleek.co')
      )
    },
    pinDescription(): string {
      return `${this.$t('pages.unlock.choose_pin_description_1')}
${this.$t('pages.unlock.choose_pin_description_2')}`
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
    // @ts-ignore
    this.isChrome = !!window.chrome
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
    async decrypt(redirect = true) {
      try {
        this.status = 'loading'
        await this.$store.dispatch(
          'accounts/unlock',
          this.pin || (this.isDev ? DEV_PIN : ''),
        )

        if (this.accounts.phrase === '') {
          // manually clear local storage and indexeddb if it exists
          try {
            await this.deleteAccount()
          } catch (e: any) {
            this.$toast.error(this.$t(e.message) as string)
          }
          redirect && this.$router.replace('/setup/disclaimer')
        } else {
          redirect && this.$router.replace('/')
        }
      } catch (error: any) {
        this.pin = ''
        this.error = error.message
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
        this.status = 'loading'
        await this.$store.dispatch('accounts/setPin', this.pin)
        await this.decrypt()
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.status = 'idle'
      }
    },
    async deleteAccount() {
      await this.$store.dispatch('settings/clearLocalStorage')
    },
    async clearAndReset() {
      if (this.status === 'loading') {
        return
      }
      await this.deleteAccount()
      location.reload()
    },
    action() {
      if (this.step === 'login') {
        this.decrypt()
        return
      }
      this.create()
    },
    togglePinInfoModal() {
      this.$store.commit('ui/toggleModal', {
        name: 'pinInfo',
        state: !this.ui.modals.pinInfo,
      })
    },
    // FOR DEVELOPMENT PURPOSES ONLY
    async createRandom() {
      try {
        this.status = 'loading'
        await this.deleteAccount()
        await this.$store.dispatch(
          'accounts/setPin',
          this.pin || (this.isDev ? DEV_PIN : ''),
        )
        await this.decrypt(false)
        await this.$store.dispatch('accounts/generateWallet')
        try {
          await this.$store.dispatch('accounts/loadAccount')
        } catch (error: any) {
          if (error.message === AccountsError.USER_NOT_REGISTERED) {
            await this.$store.dispatch('accounts/registerUser', {
              name: (Math.random() + 1).toString(36).substring(2),
              image: '',
              status: 'user-status',
            })
          }
        }
        this.$router.replace('/')
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.status = 'idle'
      }
    },
  },
})
</script>

<style lang="less" scoped src="./Unlock.less"></style>
