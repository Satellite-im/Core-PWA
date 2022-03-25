<template src="./Phrase.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { AccountsState } from '~/store/accounts/types'

declare module 'vue/types/vue' {
  interface Vue {
    accounts: AccountsState
  }
}
export default Vue.extend({
  name: 'PhraseScreen',
  head() {
    return {
      title: this.meta.title,
    }
  },
  computed: {
    ...mapState(['accounts', 'meta']),
    splitPhrase(): Array<String> {
      return this.accounts.phrase.split(' ')
    },
  },
  methods: {
    isOdd(num: any) {
      return num % 2
    },
    confirm() {
      this.$router.replace('/')
    },
  },
})
</script>

<style lang="less" scoped src="./Phrase.less"></style>
