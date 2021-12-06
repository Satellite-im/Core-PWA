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
    recoverAccount() {
      /* recover account action will be implemented on bip39 service ticket */
    },
    isOdd(num: number) {
      return num % 2
    },
    removeWord(index: number) {
      this.phrases.splice(index, 1)
    },
    onSelected(item: string) {
      if (this.phrases.length < 12 && !this.phrases.includes(item))
        this.phrases.push(item)
    },
  },
})
</script>

<style lang="less" scoped src="./InputAccount.less"></style>
