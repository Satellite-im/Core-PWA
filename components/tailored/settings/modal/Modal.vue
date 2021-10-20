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
    /**
     * @method toggleSidebar DocsTODO
     * @description
     * @example
     */
    toggleSidebar() {
      this.$data.sidebar = !this.$data.sidebar
    },
    /**
     * @method showSidebar DocsTODO
     * @description
     * @example
     */
    showSidebar() {
      this.$data.sidebar = true
    },
    /**
     * @method collapseSidebar DocsTODO
     * @description
     * @example
     */
    collapseSidebar() {
      this.$data.sidebar = false
    },
    /**
     * @method changeRoute DocsTODO
     * @description
     * @param route
     * @example
     */
    changeRoute(route: string) {
      this.$data.page = route
      if (this.$device.isMobile) {
        this.collapseSidebar()
      }
    },
    /**
     * @method closeModal DocsTODO
     * @description
     * @example
     */
    closeModal() {
      this.$store.commit('ui/toggleSettings', false)
    },
  },
})
</script>

<style scoped lang="less" src="./Modal.less"></style>
<style lang="less">
#settings.is-collapsed
  > div.sidebar.is-secondary-background
  > section
  > div.aside-menu.hidden-scroll
  > svg {
  right: 0.9rem !important;
}
#settings.is-collapsed
  > div.sidebar.is-secondary-background
  > section
  > div.aside-menu.hidden-scroll
  > aside {
  display: none;
}
</style>
