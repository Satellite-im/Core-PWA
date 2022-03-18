<template src="./Slimbar.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { SettingsIcon, PlusIcon, SatelliteIcon } from 'satellite-lucide-icons'
import { ModalWindows } from '~/store/ui/types'

export default Vue.extend({
  components: {
    SettingsIcon,
    PlusIcon,
    SatelliteIcon,
  },
  props: {
    horizontal: {
      type: Boolean,
      default: false,
    },
    unreads: {
      type: Array,
      default() {
        return []
      },
    },
    servers: {
      type: Array,
      default() {
        return []
      },
    },
    openModal: {
      type: Function,
      default: () => {},
      required: false,
    },
  },
  computed: {
    ...mapState(['ui']),
    ModalWindows: () => ModalWindows,
  },
  methods: {
    /**
     * @method toggleModal
     * @param modalName - enum for which modal
     * @description This updates the state to show/hide the specific modal you pass in
     * @example toggleModal(ModalWindows.WALLET)
     */
    toggleModal(modalName: keyof ModalWindows): void {
      this.$store.commit('ui/toggleModal', {
        name: modalName,
        state: !this.ui.modals[modalName],
      })
    },
  },
})
</script>

<style scoped lang="less" src="./Slimbar.less"></style>
