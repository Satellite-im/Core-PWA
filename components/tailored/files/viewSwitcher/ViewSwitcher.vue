<template src="./ViewSwitcher.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
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
