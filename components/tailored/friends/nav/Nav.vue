<template src="./Nav.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    setRoute: {
      type: Function,
      default: () => () => {}
    },
    route: {
      type: String,
      default: 'active',
    },
  }
})
</script>
<style scoped lang="less" src="./Nav.less"></style>
