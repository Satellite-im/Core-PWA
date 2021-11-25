<template src="./Modal.html" />

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'Modal',
  props: {
    nopad: {
      type: Boolean,
      default: false,
    },
    closeModal: {
      type: Function,
      default: () => {},
      required: false,
    },
    title: {
      type: String,
      default: '',
      required: false,
    },
  },
  methods: {
    /**
     * @method close DocsTODO
     * @description
     * @example
     */
    close() {
      this.closeModal()
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Modal.less"></style>
