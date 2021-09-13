<template src="./Modal.html"></template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      page: 'personalize',
      sidebar: true,
    }
  },
  methods: {
    /**
     * Opens and closes the left hand sidebar
     */
    toggleSidebar() {
      this.$data.sidebar = !this.$data.sidebar
    },
    showSidebar() {
      this.$data.sidebar = true
    },
    collapseSidebar() {
      this.$data.sidebar = false
    },
    changeRoute(route: string) {
      this.$data.page = route
      if (this.$device.isMobile) {
        this.collapseSidebar()
      }
    },
    closeModal() {
      this.$store.commit('toggleSettings', false)
    },
  },
})
</script>

<style scoped lang="less" src="./Modal.less"></style>
<style lang="less">
#settings.is-collapsed > div.sidebar.is-secondary-background > section > div.aside-menu.hidden-scroll > svg {
  right: 0.9rem !important;
}
#settings.is-collapsed > div.sidebar.is-secondary-background > section > div.aside-menu.hidden-scroll > aside {
  display: none;
}
</style>