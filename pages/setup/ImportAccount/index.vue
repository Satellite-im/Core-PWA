<template src="./ImportAccount.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
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
  data() {
    return {
      error: '',
      phrases: [],
      bipList: bip39.wordlists.english,
    }
  },
  head() {
    return {
      title: this.meta.title,
    }
  },
  computed: {
    ...mapState(['meta']),
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
      if (!this.phrases.includes(item) && this.phrases.length < 12)
        this.phrases.push(item)
    },
    onMultipleSelected(items: string[]) {
      const filteredItems = items.filter((item) => {
        return this.bipList.includes(item)
      })
      filteredItems.every((item) => {
        if (!this.phrases.includes(item) && this.phrases.length < 12) {
          this.phrases.push(item)
          return true
        }
        return false
      })
    },
  },
})
</script>

<style lang="less" scoped src="./ImportAccount.less"></style>
