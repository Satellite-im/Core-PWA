<template src="./ErrorNetwork.html" />

<script>
import Vue from 'vue'
import { mapState } from 'vuex'
import { throttle } from 'lodash'

import { RefreshCwIcon } from 'satellite-lucide-icons'

import { Config } from '~/config'

/**
 * @component Error
 * @description Component that takes an error message to display including source and extra details.
 * setTimeout prop is a bool that if true will auto close the modal after 5 seconds
 * @example
 */
export default Vue.extend({
  name: 'ErrorNetwork',
  components: {
    RefreshCwIcon,
  },
  watch: {
    $route(to, from) {
      if (to !== from) {
        this.closeNetworkErrorPopup()
      }
    },
  },
  methods: {
    /**
     * @method toggleNetworkErrorPopup
     * @description
     * @example
     */
    closeNetworkErrorPopup: throttle(function () {
      this.$store.commit('ui/toggleErrorNetworkModal', {
        state: false,
        action: null,
      })
    }, Config.modal.errorNetworkActionThrottle),
    /**
     * @method tryAgain
     * @description
     * @example
     */
    tryAgain() {
      this.$store.state.ui.modals.errorNetwork.action()
      this.closeNetworkErrorPopup()
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./ErrorNetwork.less"></style>
