<template src="./Popup.html"></template>
<script lang="ts">
import Vue from 'vue'

import { mapState } from 'vuex'

import { WalletIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    WalletIcon,
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    toggleWallet() {
      this.$store.commit('ui/toggleModal', {
        name: 'wallet',
        state: !this.ui.modals.wallet,
      })
    },
  },
})
</script>
<style scoped lang="less" src="./Popup.less"></style>
