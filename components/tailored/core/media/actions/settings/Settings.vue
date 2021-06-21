<template src="./Settings.html"></template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      menuOpen: false,
    }
  },
  methods: {
    toggleMenu() {
      this.$data.menuOpen = !this.$data.menuOpen
    },
  },
})
</script>

<style scoped lang="less" src="./Settings.less"></style>
