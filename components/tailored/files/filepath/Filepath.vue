<template src="./Filepath.html"></template>
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
     * Pull n amount of children off the path
     */
    pull: {
      type: Function,
      default: () => () => {},
    },
    /**
     * Set the path array manually
     */
    setPath: {
      type: Function,
      default: () => () => {},
    },
  },
  methods: {
    /**
     * Gets the data path attribute and manually updates parent path
     */
    /**
     * @method jumpTo DocsTODO
     * @description
     * @param e
     * @returns
     * @example
     */
    jumpTo(e: Event | any) {
      this.setPath(JSON.parse(e.currentTarget.getAttribute('data-self-path')))
    },
  },
})
</script>
<style scoped lang="less" src="./Filepath.less"></style>
