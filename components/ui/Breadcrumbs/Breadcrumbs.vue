<template src="./Breadcrumbs.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  computed: {
    route() {
      return this.$route.path.split('/').filter((v: String) => v !== '')
    },
  },
  methods: {
    buildLink(depth: number) {
      return `/${this.route.slice(0, depth + 1).join('/')}`
    },
  },
})
</script>
<style scoped lang="less" src="./Breadcrumbs.less"></style>
