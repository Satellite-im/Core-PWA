<template src="./Controls.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import {
  ArrowRightIcon,
  SmileIcon,
  BoxSelectIcon,
  BanknoteIcon,
} from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    BanknoteIcon,
    SmileIcon,
    BoxSelectIcon,
    ArrowRightIcon,
  },
  props: {
    disabled: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapState(['ui']),
  },
  methods: {
    /**
     * @method toggleEnhancers
     * @description Toggles enhancers by committing the opposite of it's current value (this.ui.enhancers.show) to toggleEnhancers in state
     * @example v-on:click="toggleEnhancers"
     */
    toggleEnhancers(route: string) {
      this.$store.commit('ui/toggleEnhancers', {
        show:
          (this.ui.enhancers.show && this.ui.enhancers.route !== route) ||
          !this.ui.enhancers.show,
        floating: true,
        route,
      })
    },
    toggleMiniWallet() {
      if (this.disabled) {
        return
      }
      this.$store.commit('ui/toggleModal', {
        name: 'walletMini',
        state: !this.ui.modals.walletMini,
      })
    },
  },
})
</script>

<style lang="less" src="./Controls.less"></style>
