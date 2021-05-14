<template src="./settings/Settings.html"></template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  middleware: 'authenticated',
  data() {
    return {
      sidebar: true,
    }
  },
  watch: {
    // We want to close the sidebar when on a mobile device if a user
    // selects a setting group. This watches route changes and toggles
    // the sidebar if it's on a mobile device.
    $route() {
      if (this.$route.name?.includes('settings') && this.$device.isMobile) {
        this.sidebar = false
      }
    },
  },
  methods: {
    /**
     * Opens and closes the left hand sidebar
     */
    toggleSidebar() {
      this.$data.sidebar = !this.$data.sidebar
    },
  },
})
</script>

<style lang="less" src="./settings/Settings.less"></style>
