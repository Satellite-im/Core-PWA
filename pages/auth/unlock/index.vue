<template src="./Unlock.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { Icon } from '~/types/ui/icons'

export default Vue.extend({
  name: 'UnlockScreen',
  data() {
    return {
      pin: '',
      error: '',
      storePin: false,
      decrypting: false,
    }
  },
  computed: {
    ...mapGetters(['getPinHash']),
    ...mapState(['accounts']),
  },
  methods: {
    /**
     * @method getIcon DocsTODO
     * @description
     * @returns
     * @example
     */
    getIcon(): Icon {
      if (this.getPinHash) {
        return { style: 'far', name: 'arrow-circle-right' }
      } else {
        return { style: 'far', name: 'lock-open' }
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
        await this.$store.dispatch('unlock', this.$data.pin)

        if (this.accounts.phrase === '') {
          this.$router.replace('/setup/disclaimer')
        } else {
          this.$router.replace('/')
        }
      } catch (error) {
        this.error = error.message
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
        await this.$store.dispatch('setPin', this.$data.pin)
        await this.decrypt()
      } catch (error) {
        this.error = error.message
      }
    },
  },
})
</script>

<style lang="less" scoped src="./Unlock.less"></style>
