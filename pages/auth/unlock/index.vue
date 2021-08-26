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
      return !this.$store.state.accounts.pinHash
    },
    accountError() {
      return this.$store.state.accounts.error
    },
  },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      const { phrase } = state.accounts
      if (mutation.type === 'unlock' && phrase) {
        this.$router.replace('/')
      } else if (mutation.type === 'unlock' && phrase === '') {
        this.$router.replace('/setup/disclaimer')
      }
    })
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
    async decrypt() {
      this.$data.decrypting = true

      await this.$store.dispatch('unlock', this.$data.pin)

      this.$data.decrypting = false
    },
    // Create & store a new pin, then decrypt.
    async create() {
      await this.$store.dispatch('setPin', this.$data.pin)
    },
  },
})
</script>

<style lang="less" scoped src="./Unlock.less"></style>
