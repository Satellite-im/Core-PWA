<template src="./Profile.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  name: 'ProfileSettings',
  layout: 'settings',
  data() {
    return {
      status: 'Some super interesting status message.',
      showPhrase: false,
    }
  },
  computed: {
    ...mapState(['accounts']),
    splitPhrase(): Array<String> {
      return this.accounts.phrase.split(' ')
    },
  },
  methods: {
    togglePhrase() {
      this.$data.showPhrase = !this.$data.showPhrase
    },
  },
})
</script>

<style scoped lang="less" src="./Profile.less"></style>
