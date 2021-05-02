<template src="./settings/Settings.html"></template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      sidebar: true,
    }
  },
  methods: {
    toggleSidebar() {
      this.$data.sidebar = !this.$data.sidebar
    },
  },
})
</script>

<style lang="less" src="./settings/Settings.less"></style>
