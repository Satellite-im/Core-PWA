<template src="./Controls.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    handleFile: {
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
    show(modalName: String) {
      // @ts-ignore
      // this.$modal.show('new-folder-modal')
      this.$store.commit('toggleModal', {name: modalName, state: true})
    },
    hide(modalName: String) {
      // @ts-ignore
      // this.$modal.hide('new-folder-modal')
      this.$store.commit('toggleModal', {name: modalName, state: false})
    },
  },
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
