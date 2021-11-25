<template src="./Unlock.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'

import { UnlockIcon, ChevronRightIcon, InfoIcon } from 'satellite-lucide-icons'

declare module 'vue/types/vue' {
  // 3. Declare augmentation for Vue
  interface Vue {
    error: string
    decrypt: () => Promise<any>
  }
}

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
    }
  },
  computed: {
    ...mapGetters('accounts', ['getPinHash', 'getPhrase']),
    ...mapState(['accounts']),
    storePin: {
      set(state) {
        this.$store.commit('accounts/setStorePin', state)
      },
      get() {
        return !this.accounts ? false : this.accounts.storePin
      },
    },
  },
  mounted() {
    // This information can be useful for users to help us find and report bugs.
    console.clear()
    console.log(
      '%c⚠️ Do not share anything from console with others. Do not run commands sent by others online.',
      'font-family: Space Mono; color:white; background: #e67e22; border-radius: 2px; padding: 0.5rem;border-right: none;',
    )
    console.log(
      '%c🪲 The following info however can be useful for bug reporting. Click the tag below to show more details.',
      'font-family: Space Mono; color:white; background: #2c3e50; border-radius: 2px; padding: 0.5rem;border-right: none;',
    )
    console.groupCollapsed('%c🛰 Satellite.im%cℹ',
      'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
      'color:white; background: #3498db;border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',)

    console.log(
      `%c${this.$config.clientVersion}   %cPre-Alpha`,
      'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
      'color:white; background: #9b59b6;border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
    )
    console.log(
      `%cBrowser %c${navigator.vendor}, ${navigator.product}`,
      'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
      'color:white; background: #9b59b6;border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
    )
    console.log(
      `%cLanguage%c${navigator.language}`,
      'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
      'color:white; background: #9b59b6;border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
    )
    console.log(
      `%cPlatform%c${navigator.platform}`,
      'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
      'color:white; background: #9b59b6;border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
    )
    if (navigator.onLine) {
      console.log(
        `%cNetwork %cConnected`,
        'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
        'color:white; background: #2ecc71; border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
      )
    } else {
      console.log(
        `%cNetwork %cOffline`,
        'font-family: Space Mono; color:white; background: #34495e; border-radius: 2px 0 0 2px; padding: 0.1rem 0.5rem;border-right: none;',
        'color:white; background: #e74c3c; border-radius: 0 2px 2px 0; padding: 0.1rem 0.5rem; border-left: none;',
      )
    }

    console.groupCollapsed(
      `%c📦 Open State`,
      'font-family: Space Mono; color: #222; background: #f1c40f; border-radius: 2px; padding: 0.1rem 0.5rem;border-right: none;',
    )
    console.log(this.$store.state)
    console.groupEnd()

    console.groupEnd()
  },
  methods: {
    /**
     * @method getIcon DocsTODO
     * @description
     * @returns
     * @example
     */
    getIcon(): String {
      if (this.getPinHash) {
        return 'unlocked'
      } else {
        return 'locked'
      }
    },
    // Decrypt stored encrypted data into memory
    /**
     * @method decrypt DocsTODO
     * @description
     * @example
     */
    async decrypt() {
      this.$data.decrypting = true
      this.error = ''

      try {
        await this.$store.dispatch('accounts/unlock', this.$data.pin)

        if (this.getPhrase === '') {
          this.$router.replace('/setup/disclaimer')
        } else {
          this.$router.replace('/')
        }
      } catch (error: any) {
        this.error = error.message
        this.$data.pin = ''
      }

      this.$data.decrypting = false
    },
    // Create & store a new pin, then decrypt.
    /**
     * @method create DocsTODO
     * @description
     * @example
     */
    async create() {
      try {
        await this.$store.dispatch('accounts/setPin', this.$data.pin)
        await this.decrypt()
      } catch (error: any) {
        this.error = error.message
      }
    },
  },
})
</script>

<style lang="less" scoped src="./Unlock.less"></style>
