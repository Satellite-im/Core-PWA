<template src="./Phrase.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['accounts']),
    splitPhrase(): Array<String> {
      return this.accounts.phrase.split(' ')
    },
  },
  methods: {
    isOdd(num: any) {
      return num % 2
    },
  },
})
</script>

<style lang="less" scoped src="./Phrase.less"></style>
