<template src="./Unlock.html"></template>

<script lang="ts">
import Vue from 'vue'
import { Icon } from '~/types/ui/icons'

export default Vue.extend({
  name: 'UnlockScreen',
  data() {
    return {
      pin: '',
      error: false,
      storePin: false,
      decrypting: false,
    }
  },
  computed: {
    newAccount() {
      return !this.$store.state.encryptedPin
    },
  },
  methods: {
    getIcon(): Icon {
      if (this.newAccount) {
        return { style: 'far', name: 'arrow-circle-right' }
      } else {
        return { style: 'far', name: 'lock-open' }
      }
    },
    // Decide if we need to store a new pin
    decideAction() {
      if (this.newAccount) {
        this.create()
      } else {
        this.decrypt()
      }
    },
    // Decrypt stored encrypted data into memory
    decrypt(): boolean {
      if (this.$data.pin.length < 5) {
        // @ts-ignore
        this.$data.error = this.$t('pages.unlock.invalid_pin')
        return false
      }

      this.$data.error = false
      this.$data.decrypting = true
      return true
    },
    // Create & store a new pin, then decrypt.
    create(): Boolean {
      this.decrypt()
      return true
    },
  },
})
</script>

<style lang="less" scoped src="./Unlock.less"></style>
