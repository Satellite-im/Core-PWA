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
      showModal: false,
    }
  },
  methods: {
    testAction() {
      console.log("meow")
      console.log(this.showModal)
      this.showModal = !this.showModal
    },
  }
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
