<template src="./Unlock.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
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
  },
  methods: {
    getIcon(): Icon {
      if (this.getPinHash) {
        return { style: 'far', name: 'arrow-circle-right' }
      } else {
        return { style: 'far', name: 'lock-open' }
      }
    },
    // Decrypt stored encrypted data into memory
    async decrypt() {
      this.$data.decrypting = true
      this.error = ''

      try {
        await this.$store.dispatch('unlock', this.$data.pin)
      } catch (error) {
        this.error = error
      }

      this.$data.decrypting = false

      if (this.$store.state.accounts.phrase === '') {
        this.$router.replace('/setup/disclaimer')
      } else {
        this.$router.replace('/')
      }
    },
    // Create & store a new pin, then decrypt.
    async create() {
      try {
        await this.$store.dispatch('setPin', this.$data.pin)
        await this.decrypt()
      } catch (error) {
        this.error = error
      }
    },
  },
})
</script>

<style lang="less" scoped src="./Unlock.less"></style>
