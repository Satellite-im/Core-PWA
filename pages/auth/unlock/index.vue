<template src="./Unlock.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { UnlockIcon, ChevronRightIcon, InfoIcon } from 'satellite-lucide-icons'
import { ConsoleWarning } from '~/utilities/ConsoleWarning'

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
      peer: null,
      showChangeLog: false,
    }
  },
  computed: {
    ...mapGetters('accounts', ['getPinHash', 'getPhrase']),
    ...mapState(['ui', 'accounts']),
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
    getIcon(): String {
      if (this.getPinHash) {
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
      this.$data.decrypting = true
      this.error = ''

      try {
        await this.$store.dispatch('accounts/unlock', this.$data.pin)

        if (this.getPhrase === '') {
          // if user deleted local storage manually via dev console, clear indexeddb as well
          if (
            (await indexedDB.databases())
              .map((db) => db.name)
              .includes(this.$Config.indexedDbName)
          ) {
            indexedDB.deleteDatabase(this.$Config.indexedDbName)
          }
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
