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
      async set(state) {
        await this.$store.commit('accounts/setStorePin', state)
        console.log(JSON.stringify(this.$store.state.prerequisites))
      },
      get() {
        return !this.accounts ? false : this.accounts.storePin
      },
    },
  },
  mounted() {
    this.$store.commit('accounts/lock')
    this.$store.commit('prerequisites/resetState')
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
