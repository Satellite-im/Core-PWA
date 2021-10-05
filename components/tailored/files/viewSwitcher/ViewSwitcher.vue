<template src="./ViewSwitcher.html"></template>
<script lang="ts">
import Vue from 'vue'

// @ts-ignore
import { GridIcon, ColumnsIcon } from 'vue-feather-icons'

export default Vue.extend({
  components: {
    GridIcon,
    ColumnsIcon,
  },
  props: {
    changeView: {
      type: Function,
      default: () => () => {},
    },
  },
  data() {
    return {
      view: 'grid',
    }
  },
  methods: {
    switchView(type: 'grid' | 'list') {
      this.$data.view = type
      this.changeView(type)
    },
  },
})
</script>
<style scoped lang="less" src="./ViewSwitcher.less"></style>
