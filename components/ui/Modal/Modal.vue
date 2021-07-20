<template src="./Modal.html"></template>

<script>
import Vue from 'vue'

export default Vue.extend({
  name: 'Modal',
  props: {
    closeModal: {
      type: Function,
      default: () => {},
      required: true,
    },
    title: {
      type: String,
      default: '',
      required: true,
    },
  },
  methods: {
    close() {
      this.closeModal()
    },
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less" src="./Modal.less"></style>
