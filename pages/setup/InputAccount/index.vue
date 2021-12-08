<template src="./InputAccount.html" />

<script lang="ts">
import Vue from 'vue'
import { PlusCircleIcon } from 'satellite-lucide-icons'
import * as bip39 from 'bip39'

export default Vue.extend({
  name: 'InputAccountScreen',
  components: {
    PlusCircleIcon,
  },
  data() {
    return {
      error: '',
      phrases: [],
      bipList: bip39.wordlists.english,
    }
  },
  methods: {
    /**
     * @method recoverAccount DocsTODO
     * @description recover account with 12 mnemonic recover phrases
     * @example this.recoverAccount()
     */
    async recoverAccount() {
      try {
        const mnemonic = this.phrases.join(' ')
        await this.$store.dispatch('accounts/setRecoverMnemonic', mnemonic)
        await this.$store.dispatch('accounts/loadAccount')
        this.$router.replace('/chat/direct')
      } catch (error: any) {
        this.error = error.message
      }
    },
    isOdd(num: number) {
      return num % 2
    },
    removeWord(index: number) {
      this.phrases.splice(index, 1)
    },
    onSelected(item: string) {
      if (this.phrases.length < 12) this.phrases.push(item)
    },
  },
})
</script>

<style lang="less" scoped src="./InputAccount.less"></style>
