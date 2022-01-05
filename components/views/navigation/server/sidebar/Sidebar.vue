<template src="./Sidebar.html" />

<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

import { MenuIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    MenuIcon,
  },
  props: {
    toggle: {
      type: Function,
      default: () => {},
    },
    showMenu: {
      type: Function,
      default: () => {},
    },
    sidebar: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['ui']),
  },
  mounted() {
    /**
     * Opens and closes the left hand sidebar upon clicking on 'direct-chat' or 'files-browse'
     * when user is on a mobile device
     */
    if (this.$route.name?.includes('files-browse') && this.$device.isMobile) {
      this.$props.toggle()
    }
    if (this.$route.name?.includes('chat-direct') && this.$device.isMobile) {
      this.$props.toggle()
    }
  },
})
</script>

<style scoped lang="less" src="./Sidebar.less"></style>
