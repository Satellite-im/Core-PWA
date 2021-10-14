<template src="./List.html"></template>
<script lang="ts">
import Vue, { PropType } from 'vue'

import {
  FilterIcon,
  FolderIcon,
  ArchiveIcon,
  FileIcon,
  ImageIcon,
  LockIcon,
  UnlockIcon,
  MoreVerticalIcon,
} from 'satellite-lucide-icons'

import { FileType, Folder } from '~/types/files/file'

export default Vue.extend({
  components: {
    FilterIcon,
    FileIcon,
    FolderIcon,
    ArchiveIcon,
    ImageIcon,
    LockIcon,
    UnlockIcon,
    MoreVerticalIcon,
  },
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
     * @example
     */
    handle(item: FileType | Folder): void {
      const hasChildren = ((<Folder>item).children)
      if (hasChildren) {
        this.push(item)
      } else {
        this.$data.file = item
      }
    },
  },
})
</script>
<style scoped lang="less" src="./List.less"></style>
