<template src="./ViewSwitcher.html"></template>
<script lang="ts">
import Vue from 'vue'

import { GridIcon, ListIcon } from 'satellite-lucide-icons'

export default Vue.extend({
  components: {
    GridIcon,
    ListIcon,
  },
  props: {
    changeView: {
      type: Function,
      default: () => () => {},
    },
  },
  data() {
    return {
      view: 'grid' as 'grid' | 'list',
    }
  },
  methods: {
    /**
     * @method switchView DocsTODO
     * @description
     * @param type
     * @returns
     * @example
     */
    switchView(type: 'grid' | 'list') {
      this.$data.view = type
      this.changeView(type)
    },
  },
})
</script>
<style scoped lang="less" src="./ViewSwitcher.less"></style>
