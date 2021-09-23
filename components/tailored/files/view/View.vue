<template src="./View.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { FileType } from '~/types/files/file'

export default Vue.extend({
  props: {
    file: {
      type: Object as PropType<FileType>,
      default: () => {},
    },
    close: {
      type: Function,
      default: () => () => {},
    },
  },
  methods: {
    /**
     * @method open DocsTODO
     * @description
     * @param location
     * @returns
     * @example
     */
    open(location: string): void {
      window.open(location)
    },
  },
})
</script>
<style scoped lang="less" src="./View.less"></style>
