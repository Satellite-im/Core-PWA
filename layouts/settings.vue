<template src="./settings/Settings.html"></template>

<script lang="ts">
import Vue from 'vue'
import { IsMobile } from '~/utilities/mobile'

export default Vue.extend({
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
      if (this.$route.name?.includes('settings') && this.IsMobile()) {
        this.sidebar = false
      }
    },
  },
  methods: {
    IsMobile,
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
