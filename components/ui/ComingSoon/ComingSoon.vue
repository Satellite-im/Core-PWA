<template src="./ComingSoon.html"></template>

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'
import { ModalWindows } from '~/store/ui/types'

declare module 'vue/types/vue' {
  interface Vue {
    overlayText: string
  }
}

export default Vue.extend({
  name: 'ComingSoon',
  props: {
    tooltipText: {
      type: String,
      default: 'Coming Soon',
      required: false,
    },
    tooltipPosition: {
      type: String,
      default: 'right',
      required: false,
    },
    marginTopOverride: {
      type: String,
      default: '0px',
      required: false,
    },
    areaCover: {
      type: Boolean,
      default: false,
      required: false,
    },
    hide: {
      type: Boolean,
      default: false,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    horizontal: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    ...mapState(['ui']),
    ModalWindows: () => ModalWindows,
  },
  methods: {
    preventClickthrough(event: Event) {
      event.stopPropagation()
    },
    toggleModal(modalName: ModalWindows) {
      this.$store.commit('ui/toggleModal', {
        name: modalName,
        state: !this.ui.modals[modalName],
      })
    },
  },
})
</script>
<style scoped lang="less" src="./ComingSoon.less"></style>
