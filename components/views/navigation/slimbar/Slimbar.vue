<template src="./Slimbar.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SettingsIcon, PlusIcon, SatelliteIcon } from 'satellite-lucide-icons'
import { ModalWindows } from '~/store/ui/types'
import { RootState } from '~/types/store/store'

type UiServer = {
  name: string
  address: string
}

export default Vue.extend({
  components: {
    SettingsIcon,
    PlusIcon,
    SatelliteIcon,
  },
  computed: {
    ...mapState({
      modals: (state) => (state as RootState).ui.modals,
    }),
    servers(): UiServer[] {
      return [
        {
          name: 'Solana Fans',
          address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        },
        {
          name: 'Satellite.im',
          address: '0x00000000219ab540356cbb839cbe05303d7705fa',
        },
        {
          name: 'Gaming',
          address: '0xbe0eb53f46cd790cd13851d5eff43d12404d33e8',
        },
        {
          name: 'Blockchain Devs',
          address: '0x73bceb1cd57c711feac4224d062b0f6ff338501e',
        },
      ]
    },
  },
  methods: {
    /**
     * @method toggleModal
     * @param modalName - enum for which modal
     * @description This updates the state to show/hide the specific modal you pass in
     * @example toggleModal(ModalWindows.WALLET)
     */
    toggleModal(modalName: ModalWindows): void {
      this.$store.commit('ui/toggleModal', {
        name: modalName,
        state: this.modals[modalName],
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Slimbar.less"></style>
