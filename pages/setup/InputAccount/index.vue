<template src="./InputAccount.html" />

<script lang="ts">
import Vue from 'vue'
import { PlusCircleIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  name: 'InputAccountScreen',
  components: {
    PlusCircleIcon
  },
  data() {
    return {
      error: '',
      phraseInput: '',
      phrases: []
    }
  },
  methods: {
    recoverAccount() {
      /* recover account action will be implemented on bip39 service ticket */
    },
    isOdd(num: number) {
      return num % 2
    },
    addPhrase() {
      if (this.phrases.length < 12) this.phrases.push(this.phraseInput)
      this.phraseInput = ''
    }
  }
})
</script>

<style lang="less" scoped src="./InputAccount.less"></style>
