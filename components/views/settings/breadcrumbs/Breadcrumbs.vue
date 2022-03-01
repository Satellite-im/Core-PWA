<template src="./Breadcrumbs.html"></template>
<script lang="ts">
import Vue from 'vue'
import { mapState } from 'vuex'

export default Vue.extend({
  computed: {
    ...mapState(['ui']),
    route() {
      return `${this.ui.settingsRoute}`
    },
  },
  methods: {
    /**
     * @method buildLink DocsTODO
     * @description
     * @param depth
     * @returns
     * @example
     */
    buildLink(depth: number) {
      return `/${this.route.slice(0, depth + 1).join('/')}`
    },
  },
})
</script>
<style scoped lang="less" src="./Breadcrumbs.less"></style>
