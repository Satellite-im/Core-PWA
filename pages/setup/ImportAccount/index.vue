<template src="./ImportAccount.html"></template>

<script lang="ts">
import Vue from 'vue'
import { PlusCircleIcon } from 'satellite-lucide-icons'
import * as bip39 from 'bip39'

declare module 'vue/types/vue' {
  interface Vue {
    bipList: Array<string>
    phrases: Array<string>
  }
}

export default Vue.extend({
  name: 'ImportAccountScreen',
  components: {
    PlusCircleIcon,
  },
  data(): { error: string; phrases: string[]; bipList: string[] } {
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
        await this.$store.commit('accounts/setPhrase', mnemonic)
        await this.$store.dispatch('accounts/setRecoverMnemonic', mnemonic)
        await this.$store.dispatch('accounts/loadAccount')
      } catch (error: any) {
        this.error = error.message
        return
      }
      this.$router.replace('/')
    },
    isOdd(num: number) {
      return num % 2
    },
    removeWord(index: number) {
      this.phrases.splice(index, 1)
      this.error = ''
    },
    onSelected(item: string) {
      if (this.phrases.length < 12) this.phrases.push(item)
    },
    onMultipleSelected(items: string[]) {
      const filteredItems = items.filter((item) => this.bipList.includes(item))

      if (filteredItems.length !== 12) return false

      this.phrases = filteredItems
    },
  },
})
</script>

<style lang="less" scoped src="./ImportAccount.less"></style>
