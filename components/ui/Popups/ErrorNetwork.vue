<template>
  <ModalDialog :primary-button="primaryButton">
    <template #image>
      <img src="~/assets/svg/mascot/sad_curious.svg" />
    </template>

    <template #title>{{ $t('popups.error_network.title') }}</template>

    <template #subtitle>{{ $t('popups.error_network.subtitle') }}</template>
  </ModalDialog>
</template>

<script>
import Vue from 'vue'
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
  computed: {
    primaryButton() {
      return {
        text: this.$t('popups.error_network.action'),
        action: this.tryAgain,
        icon: RefreshCwIcon,
      }
    },
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
    closeNetworkErrorPopup() {
      this.$store.commit('ui/toggleErrorNetworkModal', {
        state: false,
        action: null,
      })
    },
    /**
     * @method tryAgain
     * @description
     * @example
     */
    tryAgain: throttle(function () {
      this.$store.state.ui.modals.errorNetwork.action()
      this.closeNetworkErrorPopup()
    }, Config.modal.errorNetworkActionThrottle),
  },
})
</script>
