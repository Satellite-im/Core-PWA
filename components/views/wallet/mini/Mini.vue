<template>
  <div id="mini-wallet" v-click-outside="toggleWalletMini">
    <WalletMiniBody :update-method="updateMethod" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['ui']),
  },
  data() {
    return {
      method: 'send',
    }
  },
  methods: {
    toggleWalletMini() {
      /* Ignore outside toggling when send money btn is clickd (for preventing twice-toggling)  */
      const sendMoneyToggleElm = document.getElementById('send-money-toggle')
      // @ts-ignore
      if (!sendMoneyToggleElm?.contains(event.target)) {
        this.$store.commit('ui/toggleModal', {
          name: 'walletMini',
          state: !this.ui.modals.walletMini,
        })
      }
    },
    updateMethod(method: string) {
      this.$data.method = method
    },
  },
})
</script>
<style scoped lang="less" src="./Mini.less"></style>
