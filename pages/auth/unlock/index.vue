<template src="./Unlock.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      pin: '',
      error: false,
      storePin: false,
      decrypting: false,
    }
  },
  methods: {
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
  },
})
</script>

<style lang="less" scoped src="./Unlock.less"></style>
