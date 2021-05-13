<template src="./Filepath.html"></template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    path: {
      type: Array,
      default: () => [],
    },
    pull: {
      type: Function,
      default: () => {},
    },
    setPath: {
      type: Function,
      default: () => {},
    },
  },
  methods: {
    jumpTo(e: any) {
      // @ts-ignore
      this.setPath(JSON.parse(e.currentTarget.getAttribute('data-self-path')))
    },
  },
})
</script>
<style scoped lang="less" src="./Filepath.less"></style>
