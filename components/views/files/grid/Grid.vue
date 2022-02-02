<template src="./Grid.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'
import { FileType, Folder } from '~/types/files/file'

export default Vue.extend({
  props: {
    /**
     * The array of children to path through
     */
    path: {
      type: Array as PropType<Array<FileType | Folder>>,
      default: () => [],
    },
    /**
     * Push a new child to the path
     */
    push: {
      type: Function,
      default: () => () => {},
    },
  },
  data() {
    return {
      file: false,
    }
  },
  methods: {
    /**
     * @method handle DocsTODO
     * @description
     * @param item
     * @returns
     * @example
     */
    handle(item: FileType | Folder): void {
      const hasChildren = (<Folder>item).children
      if (hasChildren) {
        this.push(item)
        return
      }
      this.$data.file = item
    },
  },
})
</script>
<style scoped lang="less" src="./Grid.less"></style>
