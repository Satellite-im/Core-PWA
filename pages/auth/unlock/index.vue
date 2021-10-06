<template src="./Unlock.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'

// @ts-ignore
import { UnlockIcon, ChevronRightIcon } from 'vue-feather-icons'

export default Vue.extend({
  name: 'UnlockScreen',
  components: {
    UnlockIcon,
    ChevronRightIcon,
  },
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
    getIcon(): string {
      if (this.getPinHash) {
        return 'unlocked'
      } else {
        return 'locked'
      }
    },
    // Decrypt stored encrypted data into memory
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
