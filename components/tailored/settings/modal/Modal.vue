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
    changeRoute(route: string) {
      this.$data.page = route
    },
    closeModal() {
      this.$store.commit('toggleSettings', false)
    },
  },
})
</script>

<style scoped lang="less" src="./Modal.less"></style>
