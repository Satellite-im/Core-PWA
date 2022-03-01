<template src="./Accounts.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { ClipboardIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  name: 'AccountsSettings',
  components: {
    ClipboardIcon,
  },
  layout: 'settings',
  data() {
    return {
      showPhrase: false,
      featureReadyToShow: false,
    }
  },
  computed: {
    ...mapState(['accounts']),
    storePin: {
      set(state) {
        this.$store.commit('accounts/setStorePin', state)
      },
      get() {
        return this.accounts.storePin
      },
    },
    splitPhrase(): Array<String> {
      return this.accounts.phrase.split(' ')
    },
  },
  methods: {
    /**
     * @method togglePhrase DocsTODO
     * @description
     * @example
     */
    togglePhrase() {
      this.$data.showPhrase = !this.$data.showPhrase
    },
  },
})
</script>

<style scoped lang="less" src="./Accounts.less"></style>
