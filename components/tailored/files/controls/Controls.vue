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
  methods: {
    testAction() {
      console.log("meow")
    },
  }
})
</script>
<style scoped lang="less" src="./Controls.less"></style>
