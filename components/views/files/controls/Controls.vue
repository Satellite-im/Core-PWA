<template src="./Controls.html"></template>
<script lang="ts">
import Vue from 'vue'

import { FolderPlusIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    FolderPlusIcon,
  },
  props: {
    handleFile: {
      type: Function,
      default: () => () => {},
    },
    changeView: {
      type: Function,
      default: () => () => {},
    },
  },
  data() {
    return {
      text: '',
    }
  },
  methods: {
    /**
     * @method show
     * @description Shows modals by committing the modal name with status as true to toggleModal in state
     * @param modalName Name of modal to show
     * @example v-on:click="show('newfolder')"
     */
    show(modalName: String) {
      this.$store.commit('ui/toggleModal', { name: modalName, state: true })
    },
    /**
     * @method hide
     * @description Hides modals by committing the modal name with status as false to toggleModal in state
     * @param modalName Name of modal to hide
     * @example v-on:click="hide('newfolder')"
     */
    hide(modalName: String) {
      this.$store.commit('ui/toggleModal', { name: modalName, state: false })
    },
  },
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
