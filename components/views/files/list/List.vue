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
import { Item } from '~/libraries/Files/abstracts/Item.abstract'

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
    directory: {
      type: Array as PropType<Array<Item>>,
      default: () => [],
    },
  },
  methods: {
    handle(item: Item) {
      this.$emit('handle', item)
    },
  },
})
</script>
<style scoped lang="less" src="./List.less"></style>
